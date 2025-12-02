import { useRef, useState, useEffect } from "react";
import { WebCamera, type WebCameraHandler } from "@shivantra/react-web-camera";

export default function CameraCapture() {
  const cameraRef = useRef<WebCameraHandler>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMediaDevicesSupported, setIsMediaDevicesSupported] = useState<boolean | null>(null);

  // Проверяем доступность MediaDevices API при монтировании компонента
  useEffect(() => {
    const checkMediaDevices = async () => {
      try {
        // Проверяем наличие navigator.mediaDevices
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setIsMediaDevicesSupported(false);
          setError(
            "MediaDevices API недоступен. " +
            "Для работы камеры требуется HTTPS или localhost. " +
            `Текущий URL: ${window.location.protocol}//${window.location.host}`
          );
          return;
        }

        // Пытаемся получить список устройств для проверки доступности
        try {
          await navigator.mediaDevices.enumerateDevices();
          setIsMediaDevicesSupported(true);
          setError(null);
        } catch (err) {
          setIsMediaDevicesSupported(false);
          const errorMessage = err instanceof Error ? err.message : "Неизвестная ошибка";
          setError(
            `MediaDevices API недоступен: ${errorMessage}. ` +
            "Убедитесь, что вы используете HTTPS или localhost."
          );
        }
      } catch (err) {
        setIsMediaDevicesSupported(false);
        const errorMessage = err instanceof Error ? err.message : "Неизвестная ошибка";
        setError(`Ошибка проверки MediaDevices: ${errorMessage}`);
      }
    };

    checkMediaDevices();
  }, []);

  const takePhoto = async () => {
    try {
      if (!cameraRef.current) {
        setError("Камера не инициализирована");
        return;
      }

      const file = await cameraRef.current.capture();
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setPhoto(imageUrl);
        setError(null);
      } else {
        setError("Не удалось захватить изображение");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Неизвестная ошибка";
      setError(`Ошибка при захвате: ${errorMessage}`);
      console.error("Ошибка захвата фото:", err);
    }
  };

  const handleSwitch = async () => {
    try {
      await cameraRef.current?.switch();
    } catch (err) {
      console.error("Ошибка переключения камеры:", err);
    }
  };

  // Если MediaDevices API не поддерживается, показываем только сообщение об ошибке
  if (isMediaDevicesSupported === false) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h2>Camera Example</h2>
        <div style={{ 
          margin: "20px 0", 
          padding: "20px", 
          backgroundColor: "#fff3cd", 
          border: "1px solid #ffc107",
          borderRadius: 8,
          color: "#856404"
        }}>
          <h3 style={{ marginTop: 0 }}>⚠️ Камера недоступна</h3>
          {error && <p>{error}</p>}
          <div style={{ marginTop: 16, textAlign: "left" }}>
            <p><strong>Решения:</strong></p>
            <ul style={{ textAlign: "left", display: "inline-block" }}>
              <li>Используйте <code>localhost</code> вместо IP-адреса</li>
              <li>Или включите HTTPS в настройках Vite</li>
              <li>Или используйте браузер, который поддерживает MediaDevices на HTTP (не рекомендуется)</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Camera Example</h2>

      {/* Превью с камеры */}
      {isMediaDevicesSupported === true && (
        <div style={{ margin: "20px 0" }}>
          <WebCamera
            ref={cameraRef}
            style={{ width: "100%", maxWidth: 640, margin: "0 auto" }}
            videoStyle={{ borderRadius: 8 }}
            captureMode="back"
            onError={(err) => {
              setError(`Ошибка камеры: ${err.message}`);
              console.error("Ошибка камеры:", err);
            }}
          />
        </div>
      )}

      {/* Индикатор загрузки */}
      {isMediaDevicesSupported === null && (
        <div style={{ margin: "20px 0", padding: "20px" }}>
          <p>Проверка доступности камеры...</p>
        </div>
      )}

      {/* Кнопки управления */}
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 16 }}>
        <button 
          onClick={takePhoto} 
          disabled={isMediaDevicesSupported !== true || !cameraRef.current}
          style={{ 
            padding: "10px 20px",
            opacity: (isMediaDevicesSupported !== true || !cameraRef.current) ? 0.5 : 1,
            cursor: (isMediaDevicesSupported !== true || !cameraRef.current) ? "not-allowed" : "pointer"
          }}
        >
          Сделать снимок
        </button>
        <button 
          onClick={handleSwitch} 
          disabled={isMediaDevicesSupported !== true || !cameraRef.current}
          style={{ 
            padding: "10px 20px",
            opacity: (isMediaDevicesSupported !== true || !cameraRef.current) ? 0.5 : 1,
            cursor: (isMediaDevicesSupported !== true || !cameraRef.current) ? "not-allowed" : "pointer"
          }}
        >
          Переключить камеру
        </button>
      </div>

      {/* Вывод ошибки */}
      {error && (
        <div style={{ marginTop: 16, color: "red" }}>
          {error}
        </div>
      )}

      {/* Вывод снимка */}
      {photo && (
        <div style={{ marginTop: 20 }}>
          <h3>Снимок:</h3>
          <img
            src={photo}
            alt="snapshot"
            style={{ width: "100%", maxWidth: 300, borderRadius: 8, marginTop: 10 }}
          />
        </div>
      )}
    </div>
  );
}
