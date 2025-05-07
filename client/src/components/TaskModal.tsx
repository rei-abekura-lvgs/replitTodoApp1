import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertTaskSchema } from "@shared/schema";
import { useTaskContext } from "@/contexts/TaskContext";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

// フォームスキーマを拡張
const taskFormSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  dueTime: z.string().optional(),
  priority: z.enum(["1", "2", "3"]).default("2"),
  categoryId: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

export default function TaskModal() {
  const { toast } = useToast();
  const { 
    isTaskModalOpen, 
    setTaskModalOpen, 
    selectedTask, 
    setSelectedTask, 
    createTask,
    updateTask,
    categories
  } = useTaskContext();
  
  // 送信中状態を管理
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // フォーム初期化
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      dueTime: "",
      priority: "2",
      categoryId: "",
    },
  });
  
  // 選択されたタスクがある場合はフォームに値をセット
  useEffect(() => {
    if (selectedTask) {
      const dueDate = selectedTask.dueDate 
        ? format(new Date(selectedTask.dueDate), "yyyy-MM-dd")
        : "";
      
      const dueTime = selectedTask.dueDate 
        ? format(new Date(selectedTask.dueDate), "HH:mm")
        : "";
      
      form.reset({
        title: selectedTask.title,
        description: selectedTask.description || "",
        dueDate,
        dueTime,
        priority: selectedTask.priority.toString() as "1" | "2" | "3",
        categoryId: selectedTask.categoryId ? selectedTask.categoryId.toString() : "",
      });
    } else {
      form.reset({
        title: "",
        description: "",
        dueDate: "",
        dueTime: "",
        priority: "2",
        categoryId: "",
      });
    }
  }, [selectedTask, form]);
  
  // モーダルを閉じる処理
  const handleClose = () => {
    setTaskModalOpen(false);
    setSelectedTask(null);
    form.reset();
  };
  
  // フォーム送信処理
  const onSubmit = async (data: TaskFormValues) => {
    // 既に送信中なら処理をスキップ
    if (isSubmitting) return;
    
    try {
      // 送信中状態に設定
      setIsSubmitting(true);
      
      // 日付と時間を結合
      let dueDate: Date | null = null;
      
      if (data.dueDate) {
        try {
          // 日付と時間を結合して処理（時間がない場合は00:00:00を使用）
          const timeString = data.dueTime || "00:00:00";
          const dateTimeString = `${data.dueDate}T${timeString}`;
          
          dueDate = new Date(dateTimeString);
          
          // 日付が有効かチェック
          if (isNaN(dueDate.getTime())) {
            toast({
              title: "エラー",
              description: "無効な日付または時間の形式です",
              variant: "destructive",
            });
            setIsSubmitting(false);
            return; // 早期リターンで処理を中断
          }
        } catch (dateError) {
          toast({
            title: "エラー",
            description: "日付の処理中にエラーが発生しました",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return; // 早期リターンで処理を中断
        }
      }
      
      // カテゴリIDの処理
      const categoryId = data.categoryId && data.categoryId !== "none" ? parseInt(data.categoryId) : null;
      
      // タスクデータの準備
      const taskData = {
        title: data.title,
        description: data.description || "",
        isCompleted: selectedTask ? selectedTask.isCompleted : false,
        // ISO文字列として日付を扱う（サーバー側でDate型に変換される）
        dueDate, 
        priority: parseInt(data.priority),
        categoryId,
      };
      
      // APIリクエスト用にデータを確認
      console.log("送信するタスクデータ:", taskData);

      if (selectedTask) {
        // 更新の場合
        await updateTask(selectedTask.id, {
          ...taskData,
          // 日付は既にValidateされており、ISO文字列に変換して送信
          dueDate: dueDate ? dueDate.toISOString() : null
        });
      } else {
        // 新規作成の場合
        await createTask({
          ...taskData,
          // 日付は既にValidateされており、ISO文字列に変換して送信
          dueDate: dueDate ? dueDate.toISOString() : null
        });
      }
      
      // タスク保存成功後にモーダルを閉じる
      handleClose();
    } catch (error: any) {
      console.error("タスク保存エラー:", error);
      
      // APIレスポンスからエラーメッセージを抽出する
      let errorMessage = "タスクの保存中にエラーが発生しました";
      
      if (error.response) {
        try {
          // レスポンスボディがJSON形式の場合
          const responseData = error.response.data;
          if (responseData && responseData.message) {
            errorMessage = responseData.message;
            
            // 詳細なエラー情報がある場合
            if (responseData.detail) {
              errorMessage += `: ${responseData.detail}`;
            }
            
            // Zodバリデーションエラーの場合
            if (responseData.errors && Array.isArray(responseData.errors)) {
              const errorDetails = responseData.errors
                .map((err: any) => err.message || JSON.stringify(err))
                .join(", ");
              errorMessage += ` (${errorDetails})`;
            }
          }
        } catch (parseError) {
          // JSONパースエラーなど、レスポンス解析に失敗した場合
          console.error("エラーレスポンスの解析に失敗:", parseError);
        }
      } else if (error.message) {
        // 一般的なエラーメッセージがある場合
        errorMessage = error.message;
      }
      
      toast({
        title: "エラー",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      // 送信中状態を解除
      setIsSubmitting(false);
    }
  };
  
  return (
    <div 
      className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center z-50 fade-in" 
      onClick={(e) => {
        // モーダルの背景部分をクリックした場合のみモーダルを閉じる
        // ターゲット要素が背景そのものである場合のみ閉じる
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-xl shadow-lg w-full max-w-xl mx-4 md:mx-0 p-4 relative"
        style={{ 
          margin: '20px', 
          padding: '16px',
          border: '2px solid #f8fafc',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }} /* 外枠に余白を追加し、見た目も改善 */
        onClick={(e) => {
          // イベントの伝播を停止して、モーダル背景のクリックイベントが発火しないようにする
          e.stopPropagation();
        }}
      >
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-slate-800">
            {selectedTask ? "タスクを編集" : "新しいタスク"}
          </h3>
          <button 
            className="text-slate-500 hover:text-slate-700" 
            onClick={handleClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <div className="p-4">
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(onSubmit)} 
              className="space-y-4"
              onClick={(e) => e.stopPropagation()} // フォーム内のクリックでモーダルが閉じないようにする
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>タイトル <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="タスクのタイトルを入力" 
                        onClick={(e) => e.stopPropagation()}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>説明</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="タスクの詳細を入力" 
                        rows={3}
                        onClick={(e) => e.stopPropagation()}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>期限日</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          onClick={(e) => e.stopPropagation()}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dueTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>期限時間</FormLabel>
                      <FormControl>
                        <Input 
                          type="time" 
                          onClick={(e) => e.stopPropagation()}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>優先度</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex space-x-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* 高優先度 */}
                        <div 
                          className={`flex-1 rounded-md p-3 flex items-center justify-center cursor-pointer
                            border-2 transition-all duration-200
                            ${field.value === "3" 
                              ? "bg-red-100 border-red-500 shadow-md" 
                              : "border-slate-200 hover:bg-red-50"}`}
                        >
                          <RadioGroupItem value="3" id="priority-high" className="sr-only" />
                          <label htmlFor="priority-high" className="flex flex-col items-center cursor-pointer w-full justify-center">
                            {/* 優先度高アイコン - 上向き三角形 */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mb-1">
                              <polygon points="12 2 4 14 20 14" />
                            </svg>
                            <span className={`text-sm font-medium ${field.value === "3" ? "text-red-700 font-bold" : "text-red-500"}`}>高</span>
                          </label>
                        </div>
                        
                        {/* 中優先度 */}
                        <div 
                          className={`flex-1 rounded-md p-3 flex items-center justify-center cursor-pointer
                            border-2 transition-all duration-200
                            ${field.value === "2" 
                              ? "bg-amber-100 border-amber-500 shadow-md" 
                              : "border-slate-200 hover:bg-amber-50"}`}
                        >
                          <RadioGroupItem value="2" id="priority-medium" className="sr-only" />
                          <label htmlFor="priority-medium" className="flex flex-col items-center cursor-pointer w-full justify-center">
                            {/* 優先度中アイコン - 四角形 */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 mb-1">
                              <rect x="6" y="6" width="12" height="12" rx="2" />
                            </svg>
                            <span className={`text-sm font-medium ${field.value === "2" ? "text-amber-700 font-bold" : "text-amber-500"}`}>中</span>
                          </label>
                        </div>
                        
                        {/* 低優先度 */}
                        <div 
                          className={`flex-1 rounded-md p-3 flex items-center justify-center cursor-pointer
                            border-2 transition-all duration-200
                            ${field.value === "1" 
                              ? "bg-green-100 border-green-500 shadow-md" 
                              : "border-slate-200 hover:bg-green-50"}`}
                        >
                          <RadioGroupItem value="1" id="priority-low" className="sr-only" />
                          <label htmlFor="priority-low" className="flex flex-col items-center cursor-pointer w-full justify-center">
                            {/* 優先度低アイコン - 下向き三角形 */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mb-1">
                              <polygon points="4 10 12 22 20 10" />
                            </svg>
                            <span className={`text-sm font-medium ${field.value === "1" ? "text-green-700 font-bold" : "text-green-500"}`}>低</span>
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>カテゴリ</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger onClick={(e) => e.stopPropagation()}>
                          <SelectValue placeholder="カテゴリを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">カテゴリなし</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  キャンセル
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "保存中..." : "保存"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
