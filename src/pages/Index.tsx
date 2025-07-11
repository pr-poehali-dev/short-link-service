import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({ clicks: 0, created: "" });

  const handleShorten = async () => {
    if (!originalUrl) return;

    setIsLoading(true);

    // Генерируем короткий код
    const shortCode = Math.random().toString(36).substring(2, 8);
    const currentHost = window.location.origin;
    const newShortUrl = `${currentHost}/${shortCode}`;

    // Создаем объект ссылки
    const linkData = {
      id: Date.now().toString(),
      originalUrl,
      shortCode,
      clicks: 0,
      created: new Date().toLocaleDateString("ru-RU"),
      expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 дней для анонимных
    };

    // Сохраняем в localStorage
    const existingLinks = JSON.parse(
      localStorage.getItem("shortLinks") || "[]",
    );
    existingLinks.push(linkData);
    localStorage.setItem("shortLinks", JSON.stringify(existingLinks));

    setTimeout(() => {
      setShortUrl(newShortUrl);
      setStats({ clicks: 0, created: new Date().toLocaleDateString("ru-RU") });
      setIsLoading(false);
      toast({
        title: "Ссылка сокращена!",
        description: "Короткая ссылка готова к использованию",
      });
    }, 1000);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    toast({
      title: "Скопировано!",
      description: "Ссылка скопирована в буфер обмена",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Link" className="text-primary" size={24} />
              <h1 className="text-xl font-bold text-gray-900">URL SHORTENER</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-xs">
                <Icon name="Users" size={12} className="mr-1" />
                Анонимный
              </Badge>
              <Button variant="outline" size="sm">
                <Icon name="User" size={16} className="mr-1" />
                Войти
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Сокращайте ссылки
              <span className="text-primary block">быстро и просто</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Создавайте короткие ссылки, отслеживайте переходы и управляйте
              своими URL
            </p>
          </div>

          {/* URL Shortener Form */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Icon name="LinkIcon" className="mr-2" size={20} />
                Сократить ссылку
              </CardTitle>
              <CardDescription>
                Вставьте длинную ссылку и получите короткую
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  type="url"
                  placeholder="https://example.com/very-long-url-here"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleShorten}
                  disabled={!originalUrl || isLoading}
                  className="px-8"
                >
                  {isLoading ? (
                    <Icon name="Loader2" className="animate-spin" size={16} />
                  ) : (
                    <>
                      <Icon name="Scissors" className="mr-2" size={16} />
                      Сократить
                    </>
                  )}
                </Button>
              </div>

              {shortUrl && (
                <div className="animate-fade-in">
                  <Separator className="my-6" />
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        Короткая ссылка:
                      </span>
                      <Button variant="outline" size="sm" onClick={handleCopy}>
                        <Icon name="Copy" size={14} className="mr-1" />
                        Копировать
                      </Button>
                    </div>
                    <div className="text-primary font-mono text-lg break-all">
                      {shortUrl}
                    </div>
                    <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Icon name="MousePointer" size={14} className="mr-1" />
                        Переходов: {stats.clicks}
                      </div>
                      <div className="flex items-center">
                        <Icon name="Calendar" size={14} className="mr-1" />
                        Создано: {stats.created}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="BarChart3" className="text-primary" size={24} />
                </div>
                <h3 className="font-semibold mb-2">Аналитика</h3>
                <p className="text-sm text-gray-600">
                  Отслеживайте клики и источники трафика
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="QrCode" className="text-primary" size={24} />
                </div>
                <h3 className="font-semibold mb-2">QR-коды</h3>
                <p className="text-sm text-gray-600">
                  Генерируйте QR-коды для ваших ссылок
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Clock" className="text-primary" size={24} />
                </div>
                <h3 className="font-semibold mb-2">TTL управление</h3>
                <p className="text-sm text-gray-600">
                  Настраивайте время жизни ссылок
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Info Section */}
          <div className="mt-12 text-center">
            <div className="bg-blue-50 rounded-lg p-6 inline-block">
              <div className="flex items-center justify-center mb-2">
                <Icon name="Info" className="text-blue-600 mr-2" size={20} />
                <span className="text-blue-800 font-medium">
                  Для анонимных пользователей
                </span>
              </div>
              <p className="text-blue-700 text-sm">
                Ссылки хранятся 5 дней. Зарегистрируйтесь для расширенных
                возможностей.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              © 2024 URL Shortener. Быстро, просто, надежно.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
