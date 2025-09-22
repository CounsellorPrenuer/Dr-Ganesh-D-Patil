import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Eye, FileText, Calendar, User, Tag } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category?: string | null;
  tags?: string[] | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

const articleSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  excerpt: z.string().min(1, "Excerpt is required").max(500, "Excerpt too long"),
  content: z.string().min(1, "Content is required").max(50000, "Content too long"),
  author: z.string().min(1, "Author is required").max(100, "Author name too long"),
  category: z.string().max(100, "Category too long").optional(),
  tags: z.string().optional(),
  published: z.boolean().default(false),
});

type ArticleForm = z.infer<typeof articleSchema>;

export default function AdminArticles() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const { data: articles, isLoading, error } = useQuery<Article[]>({
    queryKey: ["/api/admin/articles"],
  });

  const createForm = useForm<ArticleForm>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      author: "Dr. Ganesh D. Patil",
      category: "",
      tags: "",
      published: false,
    },
  });

  const editForm = useForm<ArticleForm>({
    resolver: zodResolver(articleSchema),
  });

  const createMutation = useMutation({
    mutationFn: async (data: ArticleForm) => {
      const articleData = {
        ...data,
        tags: data.tags?.trim() ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
        category: data.category?.trim() ? data.category.trim() : undefined,
      };
      const response = await apiRequest("POST", "/api/admin/articles", articleData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/articles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setIsCreateDialogOpen(false);
      createForm.reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ArticleForm }) => {
      const articleData = {
        ...data,
        tags: data.tags?.trim() ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
        category: data.category?.trim() ? data.category.trim() : undefined,
      };
      const response = await apiRequest("PUT", `/api/admin/articles/${id}`, articleData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/articles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setEditingArticle(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/admin/articles/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/articles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
  });

  const handleCreate = (data: ArticleForm) => {
    createMutation.mutate(data);
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    editForm.reset({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      author: article.author,
      category: article.category || "",
      tags: article.tags?.join(', ') || "",
      published: article.published,
    });
  };

  const handleUpdate = (data: ArticleForm) => {
    if (editingArticle) {
      updateMutation.mutate({ id: editingArticle.id, data });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this article?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading articles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert>
          <AlertDescription>
            Failed to load articles. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const publishedArticles = articles?.filter(a => a.published) || [];
  const draftArticles = articles?.filter(a => !a.published) || [];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-articles-title">
            Articles Management
          </h1>
          <p className="text-muted-foreground">
            Create and manage your knowledge articles
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" data-testid="text-total-articles">
            {articles?.length || 0} Total
          </Badge>
          <Badge variant="secondary" data-testid="text-published-articles">
            {publishedArticles.length} Published
          </Badge>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-article">
                <Plus className="h-4 w-4 mr-1" />
                Add Article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Article</DialogTitle>
                <DialogDescription>
                  Write a new article to share your knowledge and insights
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="create-title">Article Title *</Label>
                    <Input
                      id="create-title"
                      data-testid="input-create-title"
                      {...createForm.register("title")}
                      placeholder="e.g., Career Planning in Tech Industry"
                    />
                    {createForm.formState.errors.title && (
                      <p className="text-sm text-destructive">
                        {createForm.formState.errors.title.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="create-author">Author *</Label>
                    <Input
                      id="create-author"
                      data-testid="input-create-author"
                      {...createForm.register("author")}
                      placeholder="Dr. Ganesh D. Patil"
                    />
                    {createForm.formState.errors.author && (
                      <p className="text-sm text-destructive">
                        {createForm.formState.errors.author.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="create-category">Category</Label>
                    <Input
                      id="create-category"
                      data-testid="input-create-category"
                      {...createForm.register("category")}
                      placeholder="e.g., Career Guidance"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="create-tags">Tags (comma-separated)</Label>
                    <Input
                      id="create-tags"
                      data-testid="input-create-tags"
                      {...createForm.register("tags")}
                      placeholder="e.g., career, planning, tech"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-excerpt">Article Excerpt *</Label>
                  <Textarea
                    id="create-excerpt"
                    data-testid="textarea-create-excerpt"
                    {...createForm.register("excerpt")}
                    placeholder="A brief summary of the article..."
                    rows={3}
                  />
                  {createForm.formState.errors.excerpt && (
                    <p className="text-sm text-destructive">
                      {createForm.formState.errors.excerpt.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-content">Article Content *</Label>
                  <Textarea
                    id="create-content"
                    data-testid="textarea-create-content"
                    {...createForm.register("content")}
                    placeholder="Write your article content here..."
                    rows={12}
                  />
                  {createForm.formState.errors.content && (
                    <p className="text-sm text-destructive">
                      {createForm.formState.errors.content.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="create-published"
                    data-testid="switch-create-published"
                    checked={createForm.watch("published")}
                    onCheckedChange={(checked) => createForm.setValue("published", checked)}
                  />
                  <Label htmlFor="create-published">Publish immediately</Label>
                </div>

                {createMutation.error && (
                  <Alert>
                    <AlertDescription data-testid="text-create-error">
                      {(createMutation.error as any)?.error || "Failed to create article. Please check your input and try again."}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex items-center space-x-2 pt-4">
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending}
                    data-testid="button-submit-create"
                  >
                    {createMutation.isPending ? "Creating..." : "Create Article"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Published Articles */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-green-700 dark:text-green-400">
          Published Articles ({publishedArticles.length})
        </h2>
        {publishedArticles.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No published articles yet. Create and publish your first article!
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {publishedArticles.map((article) => (
              <Card key={article.id} className="hover-elevate" data-testid={`card-article-${article.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2" data-testid={`text-article-title-${article.id}`}>
                      {article.title}
                    </CardTitle>
                    <Badge variant="secondary" className="shrink-0">
                      <FileText className="h-3 w-3 mr-1" />
                      Published
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{format(new Date(article.updatedAt), "MMM dd, yyyy")}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  {article.category && (
                    <Badge variant="outline" className="text-xs">
                      {article.category}
                    </Badge>
                  )}
                  
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {article.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                      {article.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{article.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedArticle(article)}
                      data-testid={`button-view-${article.id}`}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleEdit(article)}
                      data-testid={`button-edit-${article.id}`}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDelete(article.id)}
                      data-testid={`button-delete-${article.id}`}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Draft Articles */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-orange-600 dark:text-orange-400">
          Draft Articles ({draftArticles.length})
        </h2>
        {draftArticles.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No draft articles. All articles are published!
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {draftArticles.map((article) => (
              <Card key={article.id} className="hover-elevate border-dashed" data-testid={`card-draft-${article.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2">
                      {article.title}
                    </CardTitle>
                    <Badge variant="outline" className="shrink-0">
                      Draft
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{format(new Date(article.updatedAt), "MMM dd, yyyy")}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedArticle(article)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleEdit(article)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDelete(article.id)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedArticle?.title}</DialogTitle>
            <DialogDescription>
              By {selectedArticle?.author} • {selectedArticle && format(new Date(selectedArticle.updatedAt), "MMMM dd, yyyy")}
            </DialogDescription>
          </DialogHeader>
          {selectedArticle && (
            <div className="space-y-4">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p className="lead">{selectedArticle.excerpt}</p>
                <div className="whitespace-pre-wrap">{selectedArticle.content}</div>
              </div>
              {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  {selectedArticle.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingArticle} onOpenChange={() => setEditingArticle(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Article</DialogTitle>
            <DialogDescription>
              Update article details and content
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleUpdate)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Article Title *</Label>
                <Input
                  id="edit-title"
                  {...editForm.register("title")}
                  placeholder="e.g., Career Planning in Tech Industry"
                />
                {editForm.formState.errors.title && (
                  <p className="text-sm text-destructive">
                    {editForm.formState.errors.title.message}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-author">Author *</Label>
                <Input
                  id="edit-author"
                  {...editForm.register("author")}
                  placeholder="Dr. Ganesh D. Patil"
                />
                {editForm.formState.errors.author && (
                  <p className="text-sm text-destructive">
                    {editForm.formState.errors.author.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Input
                  id="edit-category"
                  {...editForm.register("category")}
                  placeholder="e.g., Career Guidance"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
                <Input
                  id="edit-tags"
                  {...editForm.register("tags")}
                  placeholder="e.g., career, planning, tech"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-excerpt">Article Excerpt *</Label>
              <Textarea
                id="edit-excerpt"
                {...editForm.register("excerpt")}
                placeholder="A brief summary of the article..."
                rows={3}
              />
              {editForm.formState.errors.excerpt && (
                <p className="text-sm text-destructive">
                  {editForm.formState.errors.excerpt.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-content">Article Content *</Label>
              <Textarea
                id="edit-content"
                {...editForm.register("content")}
                placeholder="Write your article content here..."
                rows={12}
              />
              {editForm.formState.errors.content && (
                <p className="text-sm text-destructive">
                  {editForm.formState.errors.content.message}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="edit-published"
                checked={editForm.watch("published")}
                onCheckedChange={(checked) => editForm.setValue("published", checked)}
              />
              <Label htmlFor="edit-published">Published</Label>
            </div>

            {updateMutation.error && (
              <Alert>
                <AlertDescription>
                  {(updateMutation.error as any)?.error || "Failed to update article. Please check your input and try again."}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex items-center space-x-2 pt-4">
              <Button 
                type="submit" 
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Updating..." : "Update Article"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setEditingArticle(null)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}