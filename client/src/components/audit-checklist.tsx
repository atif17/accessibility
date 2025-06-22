import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EyeOff, Ear, Hand, Brain, Info, ChevronDown } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface ChecklistItem {
  id: number;
  category: string;
  title: string;
  description: string;
  wcagReference?: string;
  isCompleted: boolean;
}

const categoryIcons = {
  vision: EyeOff,
  hearing: Ear,
  motor: Hand,
  cognitive: Brain,
};

const categoryColors = {
  vision: "bg-blue-100 text-primary",
  hearing: "bg-green-100 text-secondary",
  motor: "bg-orange-100 text-orange-700",
  cognitive: "bg-purple-100 text-purple-700",
};

const categoryTitles = {
  vision: "Vision Impairments",
  hearing: "Hearing Impairments", 
  motor: "Motor Impairments",
  cognitive: "Cognitive Impairments",
};

export default function AuditChecklist() {
  const [selectedCategory, setSelectedCategory] = useState<string>("vision");
  const [showAll, setShowAll] = useState(false);
  const queryClient = useQueryClient();

  const { data: allItems = [] } = useQuery<ChecklistItem[]>({
    queryKey: ['/api/checklist'],
  });

  const { data: categoryItems = [] } = useQuery<ChecklistItem[]>({
    queryKey: ['/api/checklist', selectedCategory],
    queryFn: async () => {
      const response = await fetch(`/api/checklist?category=${selectedCategory}`);
      return response.json();
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ id, isCompleted }: { id: number; isCompleted: boolean }) => {
      const response = await apiRequest('PATCH', `/api/checklist/${id}`, { isCompleted });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/checklist'] });
    },
  });

  const handleItemToggle = (id: number, isCompleted: boolean) => {
    updateItemMutation.mutate({ id, isCompleted });
  };

  const getCategoryStats = (category: string) => {
    const items = allItems.filter(item => item.category === category);
    const completed = items.filter(item => item.isCompleted).length;
    const total = items.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  };

  const currentCategoryStats = getCategoryStats(selectedCategory);
  const displayItems = showAll ? categoryItems : categoryItems.slice(0, 4);

  return (
    <section id="checklist" className="mb-16" role="region" aria-labelledby="checklist-title">
      <div className="text-center mb-12">
        <h2 id="checklist-title" className="text-3xl font-bold text-gray-900 mb-4">
          Comprehensive Audit Checklist
        </h2>
        <p className="text-xl text-gray-600">
          Step-by-step checklist covering all disability categories and WCAG requirements.
        </p>
      </div>

      {/* Disability Categories Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Object.entries(categoryTitles).map(([category, title]) => {
          const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
          const stats = getCategoryStats(category);
          const colorClass = categoryColors[category as keyof typeof categoryColors];
          
          return (
            <Card 
              key={category} 
              className={`text-center cursor-pointer transition-all ${
                selectedCategory === category ? 'ring-2 ring-primary' : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              <CardContent className="p-6">
                <IconComponent className="mx-auto text-3xl mb-3 h-8 w-8 text-primary" />
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {category === 'vision' && 'Blindness, low vision, color blindness'}
                  {category === 'hearing' && 'Deafness, hard of hearing'}
                  {category === 'motor' && 'Limited fine motor control, paralysis'}
                  {category === 'cognitive' && 'Learning disabilities, memory issues'}
                </p>
                <Badge className={colorClass}>
                  {stats.completed}/{stats.total} checks
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Interactive Checklist */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              {(() => {
                const IconComponent = categoryIcons[selectedCategory as keyof typeof categoryIcons];
                return <IconComponent className="mr-3 h-5 w-5" />;
              })()}
              {categoryTitles[selectedCategory as keyof typeof categoryTitles]} Checklist
            </CardTitle>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Progress: {currentCategoryStats.completed}/{currentCategoryStats.total}
              </span>
              <div className="w-32">
                <Progress value={currentCategoryStats.percentage} />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-4">
            {displayItems.map((item) => (
              <div key={item.id} className="flex items-start space-x-3">
                <Checkbox
                  id={`check-${item.id}`}
                  checked={item.isCompleted}
                  onCheckedChange={(checked) => 
                    handleItemToggle(item.id, checked as boolean)
                  }
                  className="mt-1"
                />
                <div className="flex-1">
                  <label 
                    htmlFor={`check-${item.id}`} 
                    className="text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    {item.title}
                  </label>
                  <p className="text-xs text-gray-600 mt-1">
                    {item.description}
                  </p>
                  {item.wcagReference && (
                    <Badge variant="outline" className="mt-1 text-xs">
                      {item.wcagReference}
                    </Badge>
                  )}
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-primary">
                      <Info className="h-4 w-4" />
                      <span className="sr-only">More information</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{item.title}</DialogTitle>
                      <DialogDescription>
                        {item.wcagReference && `WCAG Reference: ${item.wcagReference}`}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                      <p className="text-gray-700">{item.description}</p>
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">Implementation Tips:</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Test with actual assistive technology when possible</li>
                          <li>• Document your testing methodology and results</li>
                          <li>• Consider edge cases and different user scenarios</li>
                        </ul>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ))}

            {!showAll && categoryItems.length > 4 && (
              <Button 
                variant="ghost" 
                onClick={() => setShowAll(true)}
                className="text-primary"
              >
                Show all {categoryItems.length} {selectedCategory} checks 
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
