import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface ShortLink {
  id: string;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  created: string;
  expires?: string;
}

const Redirect = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [link, setLink] = useState<ShortLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!shortCode) {
      setError("Неверный код ссылки");
      setLoading(false);
      return;
    }

    // Получаем ссылку из localStorage
    const storedLinks = localStorage.getItem("shortLinks");
    if (storedLinks) {
      const links: ShortLink[] = JSON.parse(storedLinks);
      const foundLink = links.find((l) => l.shortCode === shortCode);

      if (foundLink) {
        // Проверяем срок действия
        if (foundLink.expires && new Date(foundLink.expires) < new Date()) {
          setError("Ссылка истекла");
          setLoading(false);
          return;
        }

        // Увеличиваем счетчик кликов
        foundLink.clicks += 1;

        // Добавляем запись о переходе
        const clickRecord = {
          timestamp: new Date().toISOString(),
          ip: "anonymous", // В реальном приложении здесь был бы IP
          userAgent: navigator.userAgent,
        };

        const clicksKey = `clicks_${shortCode}`;
        const existingClicks = JSON.parse(
          localStorage.getItem(clicksKey) || "[]",
        );
        existingClicks.push(clickRecord);
        localStorage.setItem(clicksKey, JSON.stringify(existingClicks));

        // Обновляем данные в localStorage
        localStorage.setItem("shortLinks", JSON.stringify(links));

        setLink(foundLink);
        setLoading(false);

        // Запускаем таймер обратного отсчета
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              window.location.href = foundLink.originalUrl;
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(timer);
      } else {
        setError("Ссылка не найдена");
        setLoading(false);
      }
    } else {
      setError("Ссылка не найдена");
      setLoading(false);
    }
  }, [shortCode]);

  const handleDirectRedirect = () => {
    if (link) {
      window.location.href = link.originalUrl;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Icon
              name="Loader2"
              className="animate-spin mx-auto mb-4 text-primary"
              size={32}
            />
            <p className="text-gray-600">Перенаправляем...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <Icon name="AlertCircle" className="mr-2" size={20} />
              Ошибка
            </CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href="/">Вернуться на главную</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center text-green-600">
            <Icon name="CheckCircle" className="mr-2" size={20} />
            Перенаправление
          </CardTitle>
          <CardDescription>
            Вы будете перенаправлены через {countdown} секунд
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Исходная ссылка:</p>
            <p className="text-primary font-mono text-sm break-all">
              {link?.originalUrl}
            </p>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <Icon name="MousePointer" size={14} className="mr-1" />
              Переходов: {link?.clicks}
            </div>
            <div className="flex items-center">
              <Icon name="Calendar" size={14} className="mr-1" />
              {link?.created}
            </div>
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleDirectRedirect} className="flex-1">
              <Icon name="ExternalLink" className="mr-2" size={16} />
              Перейти сейчас
            </Button>
            <Button variant="outline" asChild>
              <a href="/">Отмена</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Redirect;
