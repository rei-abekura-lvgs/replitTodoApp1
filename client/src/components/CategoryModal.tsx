import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertCategorySchema } from "@shared/schema";
import { useTaskContext } from "@/contexts/TaskContext";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ColorType } from "@/types";

// フォームスキーマを拡張
const categoryFormSchema = z.object({
  name: z.string().min(1, "カテゴリ名は必須です"),
  color: z.enum(["blue", "green", "red", "purple", "amber"]).default("blue"),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export default function CategoryModal() {
  const { 
    isCategoryModalOpen, 
    setCategoryModalOpen, 
    createCategory
  } = useTaskContext();
  
  // フォーム初期化
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      color: "blue",
    },
  });
  
  // モーダルを閉じる処理
  const handleClose = () => {
    setCategoryModalOpen(false);
    form.reset();
  };
  
  // フォーム送信処理
  const onSubmit = async (data: CategoryFormValues) => {
    await createCategory({
      name: data.name,
      color: data.color,
    });
    
    handleClose();
  };
  
  const colorOptions: { value: ColorType; className: string }[] = [
    { value: "blue", className: "bg-blue-500" },
    { value: "green", className: "bg-green-500" },
    { value: "red", className: "bg-red-500" },
    { value: "purple", className: "bg-purple-500" },
    { value: "amber", className: "bg-amber-500" },
  ];
  
  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center z-50 fade-in" onClick={handleClose}>
      <div 
        className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 md:mx-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-slate-800">
            新しいカテゴリ
          </h3>
          <button 
            className="text-slate-500 hover:text-slate-700" 
            onClick={handleClose}
          >
            <span className="material-icons">close</span>
          </button>
        </div>
        
        <div className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>名前 <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="カテゴリ名を入力" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>色</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="grid grid-cols-5 gap-2"
                      >
                        {colorOptions.map((option) => (
                          <div key={option.value} className="block w-full">
                            <RadioGroupItem 
                              value={option.value} 
                              id={`color-${option.value}`} 
                              className="sr-only peer" 
                            />
                            <label 
                              htmlFor={`color-${option.value}`} 
                              className={`h-10 rounded-md ${option.className} peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-${option.value}-500 cursor-pointer block`}
                            />
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleClose}
                >
                  キャンセル
                </Button>
                <Button type="submit">
                  保存
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
