import { type FC, type SyntheticEvent, useId, useRef, useState, useCallback, useEffect } from "react";
import { PlusIcon, XCircleIcon } from "@heroicons/react/24/outline";
import styles from "./record-image.module.scss";
import { Button } from "../../ui/button";
import { useMsgModal } from "../../hooks/useMsgModal";
import { MsgErrorModalUI } from "../../ui/modal/msg-error-modal/msg-error-modal";

export const STORE_FILE_PATH =
  import.meta.env.VITE_IMAGE_URL +
  "/" +
  import.meta.env.VITE_STORE_FILE_PATH!;

export const UPLOAD_FILE_PATH =
  import.meta.env.VITE_IMAGE_URL +
  "/" +
  import.meta.env.VITE_UPLOAD_FILE_PATH!;

export type RecordImageProps = {
  imageURL: string | null;
  newImageURL: string | null | undefined;
  readOnly: boolean;
  uploadFileAction: (data: FormData) => void;
  deleteImage: () => void;
  //sliceStatus: RequestStatus; 
};

export const RecordImage: FC<RecordImageProps> = (props) => {
  console.log("RecordImage+", props.newImageURL);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const cameraInputId = useId();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const msgErrorHook = useMsgModal();

  const isMediaDevicesSupported = 
    typeof navigator !== 'undefined' && 
    navigator.mediaDevices && 
    navigator.mediaDevices.getUserMedia;
  let src: string | null = null;
  if (props.newImageURL!==null ) {
    // не сброшено
    console.log('props.newImageURL')
    if (props.newImageURL)
       src = `${UPLOAD_FILE_PATH}/${props.newImageURL}`
      else if (props.imageURL) 
       src = `${STORE_FILE_PATH}/${props.imageURL}?random=${Date.now()}`;
  }

  const errorCloseAction = () => {
    setErrorMessage(null);
    msgErrorHook.closeDialog();
  };

  const processFile = useCallback((file: File) => {
    console.log('[processFile] START - получен файл:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    setErrorMessage(null);
    if (!file.type.startsWith('image/')) {
      console.error('[processFile] ERROR - неверный тип файла:', file.type);
      setErrorMessage('Пожалуйста, выберите файл изображения');
      msgErrorHook.openDialogDirectly();
      return;
    }

    // Проверка размера файла отключена
    // const maxFileSize = Number(import.meta.env.VITE_MAX_FILE_SIZE!);
    // console.log('file.size', file.size, 'maxFileSize', maxFileSize);
    // if (file.size > maxFileSize) {
    //   setErrorMessage(`Размер файла не должен превышать ${Math.round(maxFileSize / 1024)}KB`);
    //   msgErrorHook.openDialogDirectly();
    //   return;
    // }

    const dataFile = new FormData();
    dataFile.append("image", file, file.name);
    console.log('[processFile] FormData создан, вызываем uploadFileAction');
    props.uploadFileAction(dataFile);
    console.log('[processFile] END - uploadFileAction вызван');
  }, [props, msgErrorHook]);

  const handleFileChange = (e: SyntheticEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    processFile(file);
    if (e.currentTarget.value) {
      e.currentTarget.value = '';
    }
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      // Очищаем srcObject (поддержка старых браузеров, как в take-photo.tsx)
      if ('srcObject' in videoRef.current) {
        videoRef.current.srcObject = null;
      } else if ('webkitSrcObject' in videoRef.current) {
        (videoRef.current as any).webkitSrcObject = null;
      }
    }
    setIsCameraActive(false);
    setIsCapturing(false);
  }, []);

  const handleTakePhoto = useCallback(async (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(false);

    await new Promise(resolve => setTimeout(resolve, 100));

    if (isMediaDevicesSupported) {
      try {
        console.log('[handleTakePhoto] Запрос доступа к камере...');
        
        // Пробуем разные конфигурации камеры для лучшей совместимости
        // Приоритет: сначала задняя камера (environment), потом фронтальная (user), потом любая
        const cameraConfigs = [
          { video: { facingMode: 'environment' }, audio: false }, // Задняя камера (приоритет для мобильных)
          { video: { facingMode: 'user' }, audio: false }, // Фронтальная камера
          { video: true, audio: false } // Любая доступная камера (fallback для веб-камер)
        ];

        let stream: MediaStream | null = null;
        let lastError: any = null;

        for (const config of cameraConfigs) {
          try {
            console.log('[handleTakePhoto] Пробуем конфигурацию:', JSON.stringify(config));
            stream = await navigator.mediaDevices.getUserMedia(config);
            console.log('[handleTakePhoto] Поток получен успешно!');
            break;
          } catch (error: any) {
            console.warn('[handleTakePhoto] Конфигурация не сработала:', config, error?.message);
            lastError = error;
            continue;
          }
        }

        if (!stream) {
          console.error('[handleTakePhoto] Все конфигурации не сработали, последняя ошибка:', lastError);
          // Fallback на file input
          setTimeout(() => {
            if (cameraInputRef.current) {
              cameraInputRef.current.click();
            }
          }, 100);
          return;
        }
        
        streamRef.current = stream;
        
        // ВАЖНО: Устанавливаем isCameraActive сразу, чтобы overlay появился (как в take-photo.tsx)
        setIsCameraActive(true);
        
        // Ждем немного, чтобы video элемент был готов
        setTimeout(() => {
          if (videoRef.current) {
            const video = videoRef.current;
            
            // Устанавливаем srcObject (поддержка старых браузеров)
            if ('srcObject' in video) {
              video.srcObject = stream;
            } else if ('webkitSrcObject' in video) {
              (video as any).webkitSrcObject = stream;
            }
            
            // Пытаемся воспроизвести
            video.play().catch(err => {
              console.error('[handleTakePhoto] Ошибка воспроизведения видео:', err);
              setErrorMessage('Не удалось запустить камеру. Попробуйте снова.');
              msgErrorHook.openDialogDirectly();
              stopCamera();
            });
          }
        }, 100);
        
      } catch (error) {
        console.error('[handleTakePhoto] Ошибка доступа к камере:', error);
        const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
        setErrorMessage(`Не удалось получить доступ к камере: ${errorMessage}`);
        msgErrorHook.openDialogDirectly();
        stopCamera();
        
        // Fallback на file input
        setTimeout(() => {
          if (cameraInputRef.current) {
            cameraInputRef.current.click();
          }
        }, 100);
      }
    } else {
      setTimeout(() => {
        if (cameraInputRef.current) {
          cameraInputRef.current.click();
        }
      }, 100);
    }
  }, [isMediaDevicesSupported, msgErrorHook, stopCamera]);

  const handleSelectPhoto = useCallback((e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(false);
    setTimeout(() => {
      if (fileRef.current) {
        fileRef.current.click();
      }
    }, 100);
  }, []);

  const capturePhoto = useCallback(() => {
    // Защита от повторных нажатий
    if (isCapturing) {
      console.log('[capturePhoto] Уже выполняется захват, игнорируем');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      console.error('[capturePhoto] video или canvas не доступны');
      return;
    }

    // Проверка, что видео готово
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    
    if (!vw || !vh || vw === 0 || vh === 0) {
      console.error('[capturePhoto] Видео не готово:', { vw, vh });
      setErrorMessage('Камера не готова. Подождите немного и попробуйте снова.');
      msgErrorHook.openDialogDirectly();
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error('[capturePhoto] Не удалось получить контекст canvas');
      return;
    }

    console.log('[capturePhoto] Начинаем захват:', { vw, vh });
    setIsCapturing(true);

    try {
      // Устанавливаем размеры canvas равными размерам video (как в take-photo.tsx)
      canvas.width = vw;
      canvas.height = vh;

      // Рисуем video на canvas без поворотов (как в take-photo.tsx)
      ctx.drawImage(video, 0, 0);

      console.log('[capturePhoto] Canvas нарисован, создаем blob...');
      
      // Используем Promise для лучшей обработки асинхронности на Android
      new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/jpeg", 0.9);
      })
      .then((blob) => {
        if (!blob) {
          console.error('[capturePhoto] Не удалось создать blob');
          setErrorMessage('Не удалось создать изображение. Попробуйте снова.');
          msgErrorHook.openDialogDirectly();
          setIsCapturing(false);
          return;
        }

        console.log('[capturePhoto] Blob создан, размер:', blob.size);
        
        const file = new File([blob], `photo-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        
        console.log('[capturePhoto] Файл создан, вызываем processFile...');
        
        // Вызываем processFile и ждем немного перед закрытием камеры
        // чтобы дать время на обработку на Android
        processFile(file);
        
        // Задержка перед закрытием камеры для Android
        setTimeout(() => {
          console.log('[capturePhoto] Закрываем камеру');
          stopCamera();
          setIsCapturing(false);
        }, 300);
      })
      .catch((error) => {
        console.error('[capturePhoto] Ошибка при создании blob:', error);
        setErrorMessage('Ошибка при создании снимка. Попробуйте снова.');
        msgErrorHook.openDialogDirectly();
        setIsCapturing(false);
      });
    } catch (error) {
      console.error('[capturePhoto] Ошибка при захвате:', error);
      setErrorMessage('Ошибка при захвате изображения. Попробуйте снова.');
      msgErrorHook.openDialogDirectly();
      setIsCapturing(false);
    }
  }, [processFile, stopCamera, isCapturing, msgErrorHook]);

  const handleMenuClick = useCallback((e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen]);

  if (!src && props.readOnly)
    return null;

  return (
    <div className={styles.container}>
    {msgErrorHook.dialogWasOpened && (
      <MsgErrorModalUI
        message={`${errorMessage}`}
        closeAction={errorCloseAction}
      />
    )}

      {src && 
        <div className={styles.imageContainer}>
          <img src={src} data-cy="image-preview" />
          <button
              onClick={(e) => {e.preventDefault();  props.deleteImage(); }}
              data-cy="delete-button"
            ><XCircleIcon className={styles.xMarkIcon}/></button>

        </div>
      }
      {/*errorMessage && (
        <div className={styles.error} data-cy="file-error">
          {errorMessage}
        </div>
      )*/}
      {!props.readOnly && (
        <div className={styles.control}>
          <input
            id={id}
            ref={fileRef}
            className={styles.hidden}
            onChange={handleFileChange}
            data-cy="file-input"
            accept="image/*"
            type="file"
          />
          <input
            id={cameraInputId}
            ref={cameraInputRef}
            className={styles.hidden}
            onChange={handleFileChange}
            accept="image/*"
            capture="environment"
            type="file"
          />

          <div className={styles.uploadButtonWrapper}>
            {!src && <button
              onClick={handleMenuClick}
              data-cy="upload-button"
              className={styles.uploadButton}
            >
              <span className={styles.uploadButtonText}>Загрузить</span> 
              <PlusIcon className={styles.plusIcon}/>
            </button>
            }

            {isMenuOpen && !isCameraActive && (
              <div ref={menuRef} className={styles.menu}>
                <button
                  type="button"
                  className={styles.menuItem}
                  onClick={handleTakePhoto}
                  data-cy="take-photo-option"
                >
                  Сделать снимок
                </button>
                <button
                  type="button"
                  className={styles.menuItem}
                  onClick={handleSelectPhoto}
                  data-cy="select-photo-option"
                >
                  Добавить фотографию
                </button>
              </div>
            )}
          </div>

        </div>
      )}

      {isCameraActive && (
        <div className={styles.cameraOverlay}>
          <div className={styles.cameraContainer}>
            <video
              ref={videoRef}
              className={styles.cameraVideo}
              autoPlay
              playsInline
              muted
            />
            <canvas ref={canvasRef} className={styles.hiddenCanvas} />
            <div className={styles.cameraControls}>
              <button
                type="button"
                className={styles.captureButton}
                onClick={capturePhoto}
                disabled={isCapturing}
                aria-label="Сделать снимок"
              >
                <span className={styles.captureButtonInner} />
              </button>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={stopCamera}
                aria-label="Отмена"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
