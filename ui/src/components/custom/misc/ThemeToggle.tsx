import { useTheme, type Theme } from "@/components/theme-provider.js";
import { Moon, Sun } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.js";

export default function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <Tabs
        defaultValue={theme === "light" ? "light" : "dark"}
        onValueChange={(value) => setTheme(value as Theme)}
      >
        <TabsList>
          <TabsTrigger value="dark">
            <Moon />
          </TabsTrigger>
          <TabsTrigger value="light">
            <Sun />
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
