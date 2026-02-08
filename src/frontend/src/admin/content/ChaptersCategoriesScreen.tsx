import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChaptersTab from './ChaptersTab';
import CategoriesTab from './CategoriesTab';

export default function ChaptersCategoriesScreen() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-display font-bold text-white">Chapters & Categories</h2>
        <p className="text-gray-400 mt-1">Manage course structure and content organization</p>
      </div>

      <Tabs defaultValue="chapters" className="w-full">
        <TabsList className="bg-gray-900 border border-gray-800">
          <TabsTrigger value="chapters" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
            Chapters
          </TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
            Categories
          </TabsTrigger>
        </TabsList>
        <TabsContent value="chapters" className="mt-6">
          <ChaptersTab />
        </TabsContent>
        <TabsContent value="categories" className="mt-6">
          <CategoriesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
