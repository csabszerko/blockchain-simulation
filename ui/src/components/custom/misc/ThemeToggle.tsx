import { useTheme, type Theme } from "@/components/theme-provider.js";
import { Moon, Sun } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.js";

export default function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  return (
    <div className="flex items-center gap-2">
      <Tabs
        defaultValue={
          theme === "system"
            ? window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "dark"
              : "light"
            : theme
        }
        onValueChange={(value) => setTheme(value as Theme)}
      >
        <TabsList tabIndex={undefined}>
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
