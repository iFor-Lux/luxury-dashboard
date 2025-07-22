import React, { useRef, useState, useEffect, useCallback } from "react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbPage } from "./ui/breadcrumb";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { DndProvider, useDrag, useDrop, DragSourceMonitor, DropTargetMonitor } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Iconos SVG
const FolderIcon = ({ className = "text-yellow-400" }: { className?: string }) => (
  <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7a2 2 0 012-2h4l2 3h8a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
  </svg>
);

const FileIcon = ({ className = "text-zinc-400" }: { className?: string }) => (
  <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 3h6l5 5v13a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
  </svg>
);

const DotsVerticalIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-zinc-400 hover:text-zinc-200 transition-colors">
    <circle cx="12" cy="6" r="1.5"/>
    <circle cx="12" cy="12" r="1.5"/>
    <circle cx="12" cy="18" r="1.5"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-zinc-300">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const UploadIcon = () => (
  <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto mb-3 text-blue-400 group-hover:text-blue-300 transition-all">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 9l5-5 5 5M12 4v12" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-green-400">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-400">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-green-400">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ImageIcon = ({ className = "text-blue-400" }: { className?: string }) => (
  <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}>
    <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="1.5"/>
    <circle cx="8.5" cy="10.5" r="1.5"/>
    <path d="M21 19l-5.5-7-4.5 6-3-4-4 5"/>
  </svg>
);

const VideoIcon = ({ className = "text-purple-400" }: { className?: string }) => (
  <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}>
    <polygon points="23 7 16 12 23 17 23 7"/>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
  </svg>
);

const AudioIcon = ({ className = "text-pink-400" }: { className?: string }) => (
  <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}>
    <path d="M9 18V5l12-2v13"/>
    <circle cx="6" cy="18" r="3"/>
    <circle cx="18" cy="16" r="3"/>
  </svg>
);

const ZipIcon = ({ className = "text-yellow-500" }: { className?: string }) => (
  <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5"/>
    <path d="M7 3v18M17 3v18M7 7h10"/>
  </svg>
);

const CodeIcon = ({ className = "text-green-400" }: { className?: string }) => (
  <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>
  </svg>
);

const PdfIcon = ({ className = "text-red-400" }: { className?: string }) => (
  <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
  </svg>
);

const TextIcon = ({ className = "text-blue-300" }: { className?: string }) => (
  <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
  </svg>
);

const GITHUB_REPO = "iFor-Lux/luxury-files";
const GITHUB_API = `https://api.github.com/repos/${GITHUB_REPO}/contents/`;
const GITHUB_TOKEN = "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";

// Función para obtener el icono según el archivo
function getFileIcon(name: string, type: string) {
  if (type === "dir") return <FolderIcon />;
  
  const ext = name.split('.').pop()?.toLowerCase() || "";
  
  if (["png","jpg","jpeg","gif","svg","webp","bmp","ico","tiff"].includes(ext)) {
    return <ImageIcon />;
  }
  
  if (["mp4","avi","mov","wmv","flv","webm","mkv","m4v"].includes(ext)) {
    return <VideoIcon />;
  }
  
  if (["mp3","wav","flac","aac","ogg","wma","m4a"].includes(ext)) {
    return <AudioIcon />;
  }
  
  if (["zip","rar","7z","tar","gz","bz2","xz"].includes(ext)) {
    return <ZipIcon />;
  }
  
  if (["js","ts","jsx","tsx","py","java","c","cpp","cs","rb","php","go","rs","sh","html","css","scss","vue","svelte","dart","kt","swift"].includes(ext)) {
    return <CodeIcon />;
  }
  
  if (ext === "pdf") {
    return <PdfIcon />;
  }
  
  if (["txt","md","json","csv","log","xml","ini","conf","yaml","yml","toml"].includes(ext)) {
    return <TextIcon />;
  }
  
  return <FileIcon />;
}

// Función para verificar si un archivo es una imagen
function isImageFile(name: string): boolean {
  const ext = name.split('.').pop()?.toLowerCase() || "";
  return ["png","jpg","jpeg","gif","svg","webp","bmp","ico","tiff"].includes(ext);
}

// Función para verificar si un archivo es editable como texto
function isEditableFile(name: string): boolean {
  const ext = name.split('.').pop()?.toLowerCase() || "";
  return ["txt","md","json","csv","log","xml","ini","conf","yaml","yml","toml","js","ts","jsx","tsx","py","java","c","cpp","cs","rb","php","go","rs","sh","html","css","scss","vue","svelte","dart","kt","swift"].includes(ext);
}

// Tipo para drag & drop
const ItemTypes = { FILE: 'file' };

interface FileItem {
  name: string;
  type: string;
  sha: string;
  download_url?: string;
}

interface DraggableFileCardProps {
  item: FileItem;
  onMove: (item: FileItem, target: FileItem) => void;
  children: React.ReactNode;
}

function DraggableFileCard({ item, onMove, children }: DraggableFileCardProps) {
  const dragRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.FILE,
    item: { ...item },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [item]);

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.FILE,
    drop: (draggedItem: FileItem) => {
      if (item.type === 'dir' && draggedItem.name !== item.name) {
        onMove(draggedItem, item);
      }
    },
    canDrop: (draggedItem: FileItem) => item.type === 'dir' && draggedItem.name !== item.name,
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver() && monitor.canDrop(),
    }),
  }, [item, onMove]);

  drag(dragRef);
  drop(dropRef);

  return (
    <div 
      ref={dropRef} 
      style={{ opacity: isDragging ? 0.5 : 1 }} 
      className={isOver ? 'ring-2 ring-blue-400 rounded-xl' : ''}
    >
      <div ref={dragRef} style={{ cursor: 'grab' }}>
        {children}
      </div>
    </div>
  );
}

export default function FileManager() {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [items, setItems] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false); // Nuevo estado para indicador de actualización
  const [error, setError] = useState("");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Modales
  const [renameModal, setRenameModal] = useState<{open: boolean, item: FileItem | null}>({open: false, item: null});
  const [newName, setNewName] = useState("");
  const [editModal, setEditModal] = useState<{open: boolean, item: FileItem | null, content: string}>({open: false, item: null, content: ""});
  const [savingEdit, setSavingEdit] = useState(false);
  const [createFolderModal, setCreateFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{open: boolean, item: FileItem | null}>({open: false, item: null});
  const [deleting, setDeleting] = useState(false);
  const [imageModal, setImageModal] = useState<{open: boolean, item: FileItem | null, imageUrl: string}>({open: false, item: null, imageUrl: ""});
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Función para manejar interacciones del usuario
  const handleUserInteraction = useCallback(() => {
    setIsInteracting(true);
    
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
    
    interactionTimeoutRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 3000);
  }, []);

  // Detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsUserScrolling(true);
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        setIsUserScrolling(false);
      }, 2000);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, []);

  // Función para refrescar la lista de archivos
  const refreshItems = useCallback(async (preserveScroll = true, forceRefresh = false) => {
    if (!forceRefresh && preserveScroll && (
      isUserScrolling || 
      dropdownOpen || 
      isInteracting ||
      renameModal.open ||
      editModal.open ||
      createFolderModal ||
      deleteModal.open ||
      imageModal.open
    )) {
      return;
    }
    
    const currentScrollPosition = window.scrollY;
    setLoading(true);
    setError("");
    try {
      const repoPath = currentPath.length ? currentPath.join("/") : "";
      const timestamp = new Date().getTime(); // Cache-bust
      const res = await fetch(`${GITHUB_API}${encodeURIComponent(repoPath)}?ref=main&t=${timestamp}`, {
        headers: { 
          Authorization: `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        },
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Error al cargar archivos");
        setItems([]);
      } else {
        const data = await res.json();
        const newItems = Array.isArray(data) ? data.map((f: any) => ({ 
          name: f.name, 
          type: f.type, 
          sha: f.sha,
          download_url: f.download_url 
        })) : [];
        
        setItems(newItems);
        if (preserveScroll && !forceRefresh) {
          setTimeout(() => {
            window.scrollTo(0, currentScrollPosition);
          }, 50);
        }
      }
    } catch (err) {
      console.error('Error en refreshItems:', err);
      setError("Error al cargar archivos");
      setItems([]);
    }
    setLoading(false);
    setUpdating(false);
  }, [currentPath, isUserScrolling, dropdownOpen, isInteracting, renameModal.open, editModal.open, createFolderModal, deleteModal.open, imageModal.open]);

  // Configurar auto-refresh
  useEffect(() => {
    if (autoRefreshInterval) {
      clearInterval(autoRefreshInterval);
    }
    
    if (!dropdownOpen && !uploading && !deleting && !creatingFolder && !savingEdit) {
      const interval = setInterval(() => {
        refreshItems(true, false);
      }, 5000); // Reducido a 5 segundos
      setAutoRefreshInterval(interval);
      
      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }
  }, [refreshItems, dropdownOpen, uploading, deleting, creatingFolder, savingEdit]);

  // Cargar items al cambiar la ruta
  useEffect(() => {
    refreshItems(false, true);
  }, [currentPath]);

  // Mover archivo
  const handleMove = async (draggedItem: FileItem, targetFolder: FileItem) => {
    if (!draggedItem || !targetFolder || targetFolder.type !== 'dir') return;
    
    setLoading(true);
    setUpdating(true);
    setError("");
    try {
      const repoPath = currentPath.join('/');
      const oldPath = repoPath ? `${repoPath}/${draggedItem.name}` : draggedItem.name;
      const newPath = repoPath ? `${repoPath}/${targetFolder.name}/${draggedItem.name}` : `${targetFolder.name}/${draggedItem.name}`;
      
      const fileInfoRes = await fetch(`${GITHUB_API}${encodeURIComponent(oldPath)}?ref=main`, {
        headers: { 
          Authorization: `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        },
      });
      
      if (!fileInfoRes.ok) {
        const errorData = await fileInfoRes.json().catch(() => ({}));
        throw new Error(`Error al obtener información del archivo: ${fileInfoRes.status}`);
      }
      
      const fileInfo = await fileInfoRes.json();
      if (!fileInfo.sha) {
        throw new Error('No se pudo obtener el SHA del archivo');
      }
      
      const downloadUrl = fileInfo.download_url;
      if (!downloadUrl) {
        throw new Error('No se pudo obtener la URL de descarga del archivo');
      }
      
      const contentRes = await fetch(downloadUrl);
      if (!contentRes.ok) {
        throw new Error(`Error al descargar el contenido del archivo: ${contentRes.status}`);
      }
      
      const fileContent = await contentRes.text();
      
      const createRes = await fetch(`${GITHUB_API}${encodeURIComponent(newPath)}`, {
        method: "PUT",
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          message: `Mover ${draggedItem.name} a ${targetFolder.name}`,
          content: btoa(unescape(encodeURIComponent(fileContent))),
        }),
      });
      
      if (!createRes.ok) {
        const errorData = await createRes.json().catch(() => ({}));
        throw new Error(`No se pudo crear el archivo en la nueva ubicación: ${createRes.status}`);
      }
      
      const deleteRes = await fetch(`${GITHUB_API}${encodeURIComponent(oldPath)}`, {
        method: "DELETE",
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          message: `Eliminar ${draggedItem.name} tras mover`,
          sha: fileInfo.sha,
        }),
      });
      
      if (!deleteRes.ok && deleteRes.status !== 404) {
        const errorData = await deleteRes.json().catch(() => ({}));
        throw new Error(`No se pudo eliminar el archivo original: ${deleteRes.status}`);
      }
      
      await refreshItems(false, true);
    } catch (error) {
      console.error('Error al mover archivo:', error);
      setError(`Error al mover archivo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
    setLoading(false);
    setUpdating(false);
  };

  // Subir archivo
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    setUpdating(true);
    setError("");
    
    try {
      const reader = new FileReader();
      
      const uploadPromise = new Promise<void>((resolve, reject) => {
        reader.onload = async (ev) => {
          if (!ev.target?.result) {
            reject(new Error("No se pudo leer el archivo"));
            return;
          }
          
          try {
            const content = (ev.target.result as string).split(",")[1];
            const repoPath = (currentPath.length ? currentPath.join("/") + "/" : "") + file.name;
            const res = await fetch(`${GITHUB_API}${encodeURIComponent(repoPath)}`, {
              method: "PUT",
              headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                "Content-Type": "application/json",
                'Accept': 'application/vnd.github.v3+json'
              },
              body: JSON.stringify({
                message: `Subir archivo ${file.name}`,
                content,
              }),
            });
            
            if (!res.ok) {
              const data = await res.json();
              throw new Error(data.message || "Error al subir archivo");
            }
            
            // Actualización optimista
            setItems(prev => [...prev, { name: file.name, type: 'file', sha: '', download_url: '' }]);
            await refreshItems(false, true);
            resolve();
          } catch (error) {
            reject(error);
          }
        };
        
        reader.onerror = () => {
          reject(new Error("Error al leer el archivo"));
        };
        
        reader.readAsDataURL(file);
      });
      
      await uploadPromise;
    } catch (error) {
      console.error("Error al subir archivo:", error);
      setError(error instanceof Error ? error.message : "Error al subir archivo");
    } finally {
      setUploading(false);
      setUpdating(false);
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  // Cambiar nombre
  const handleRename = async () => {
    if (!renameModal.item || !newName.trim()) return;
    
    const originalExt = renameModal.item.name.includes('.') 
      ? '.' + renameModal.item.name.split('.').pop() 
      : '';
    const finalName = newName.includes('.') ? newName : newName + originalExt;
    
    setLoading(true);
    setUpdating(true);
    setError("");
    try {
      const oldPath = (currentPath.length ? currentPath.join("/") + "/" : "") + renameModal.item.name;
      const newPath = (currentPath.length ? currentPath.join("/") + "/" : "") + finalName;
      
      const getRes = await fetch(`${GITHUB_API}${encodeURIComponent(oldPath)}?ref=main`, {
        headers: { Authorization: `token ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json' },
      });
      const getData = await getRes.json();
      
      if (getData.content) {
        await fetch(`${GITHUB_API}${encodeURIComponent(newPath)}`, {
          method: "PUT",
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            "Content-Type": "application/json",
            'Accept': 'application/vnd.github.v3+json'
          },
          body: JSON.stringify({
            message: `Renombrar ${renameModal.item.name} a ${finalName}`,
            content: getData.content,
          }),
        });
        
        await fetch(`${GITHUB_API}${encodeURIComponent(oldPath)}`, {
          method: "DELETE",
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            "Content-Type": "application/json",
            'Accept': 'application/vnd.github.v3+json'
          },
          body: JSON.stringify({
            message: `Eliminar ${renameModal.item.name} tras renombrar`,
            sha: getData.sha,
          }),
        });
        
        setRenameModal({open: false, item: null});
        setNewName("");
        await refreshItems(false, true);
      }
    } catch {
      setError("Error al renombrar archivo");
    }
    setLoading(false);
    setUpdating(false);
  };

  // Eliminar archivo
  const handleDelete = async () => {
    if (!deleteModal.item) return;
    setDeleting(true);
    setUpdating(true);
    setError("");
    try {
      const repoPath = (currentPath.length ? currentPath.join("/") + "/" : "") + deleteModal.item.name;
      const res = await fetch(`${GITHUB_API}${encodeURIComponent(repoPath)}`, {
        method: "DELETE",
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          message: `Eliminar ${deleteModal.item.name}`,
          sha: deleteModal.item.sha,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Error al eliminar archivo");
      } else {
        // Actualización optimista
        setItems(prev => prev.filter(item => item.name !== deleteModal.item!.name));
        setDeleteModal({open: false, item: null});
        await refreshItems(false, true);
      }
    } catch (error) {
      console.error('Error al eliminar archivo:', error);
      setError("Error al eliminar archivo");
    }
    setDeleting(false);
    setUpdating(false);
  };

  // Descargar archivo
  const handleDownload = async (item: FileItem) => {
    if (item.type === 'dir') {
      setError("No se pueden descargar carpetas, solo archivos individuales");
      return;
    }

    setLoading(true);
    setError("");
    try {
      let downloadUrl = item.download_url;
      if (!downloadUrl) {
        const repoPath = (currentPath.length ? currentPath.join("/") + "/" : "") + item.name;
        downloadUrl = `https://raw.githubusercontent.com/${GITHUB_REPO}/main/${repoPath}`;
      }
      
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error('Error al obtener el archivo');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = item.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al descargar:', error);
      setError("Error al descargar el archivo. Verifica que el archivo existe y es accesible.");
    }
    setLoading(false);
  };

  // Abrir archivo para edición
  const handleOpenEdit = async (item: FileItem) => {
    if (!isEditableFile(item.name)) {
      setError("Este tipo de archivo no se puede editar como texto");
      return;
    }
    
    setLoading(true);
    try {
      const repoPath = (currentPath.length ? currentPath.join("/") + "/" : "") + item.name;
      const res = await fetch(`${GITHUB_API}${encodeURIComponent(repoPath)}?ref=main`, {
        headers: { Authorization: `token ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json' },
      });
      const data = await res.json();
      let content = "";
      if (data.content) {
        content = atob(data.content.replace(/\n/g, ""));
      }
      setEditModal({open: true, item, content});
    } catch {
      setError("No se pudo cargar el contenido del archivo");
    }
    setLoading(false);
  };

  // Guardar edición
  const handleSaveEdit = async () => {
    if (!editModal.item) return;
    setSavingEdit(true);
    setUpdating(true);
    setError("");
    try {
      const repoPath = (currentPath.length ? currentPath.join("/") + "/" : "") + editModal.item.name;
      const resSha = await fetch(`${GITHUB_API}${encodeURIComponent(repoPath)}?ref=main`, {
        headers: { Authorization: `token ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json' },
      });
      const dataSha = await resSha.json();
      const contentBase64 = btoa(unescape(encodeURIComponent(editModal.content)));
      const res = await fetch(`${GITHUB_API}${encodeURIComponent(repoPath)}`, {
        method: "PUT",
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          message: `Editar ${editModal.item.name}`,
          content: contentBase64,
          sha: dataSha.sha,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Error al guardar edición");
      } else {
        setEditModal({open: false, item: null, content: ""});
        await refreshItems(false, true);
      }
    } catch {
      setError("Error al guardar edición");
    }
    setSavingEdit(false);
    setUpdating(false);
  };

  // Crear carpeta
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    setCreatingFolder(true);
    setUpdating(true);
    setError("");
    try {
      const repoPath = (currentPath.length ? currentPath.join("/") + "/" : "") + newFolderName + "/.gitkeep";
      const res = await fetch(`${GITHUB_API}${encodeURIComponent(repoPath)}`, {
        method: "PUT",
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          message: `Crear carpeta ${newFolderName}`,
          content: "",
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Error al crear carpeta");
      } else {
        // Actualización optimista
        setItems(prev => [...prev, { name: newFolderName, type: 'dir', sha: '', download_url: '' }]);
        setCreateFolderModal(false);
        setNewFolderName("");
        await refreshItems(false, true);
      }
    } catch {
      setError("Error al crear carpeta");
    }
    setCreatingFolder(false);
    setUpdating(false);
  };

  // Manejar doble click
  const handleDoubleClick = (item: FileItem) => {
    if (item.type === 'dir') {
      setCurrentPath([...currentPath, item.name]);
    } else if (isImageFile(item.name)) {
      const imageUrl = item.download_url || `https://raw.githubusercontent.com/${GITHUB_REPO}/main/${currentPath.length ? currentPath.join("/") + "/" : ""}${item.name}`;
      setImageModal({open: true, item, imageUrl});
    }
  };

  // Manejar checkbox
  const handleCheckboxClick = (itemName: string, event: React.MouseEvent) => {
    event.stopPropagation();
    handleUserInteraction();
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemName)) {
      newSelected.delete(itemName);
    } else {
      newSelected.add(itemName);
    }
    setSelectedItems(newSelected);
  };

  // Navegar hacia atrás
  const goBack = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };

  return (
    <div className="min-h-[100dvh] min-h-fit from-zinc-950 via-zinc-900 to-zinc-950">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Zona de subir archivo */}
        <div className="mb-12">
          <div
            className="w-full max-w-3xl mx-auto h-48 flex flex-col items-center justify-center border-2 border-dashed border-zinc-600 rounded-3xl bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:border-blue-400 hover:bg-zinc-800/40 group shadow-2xl"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon />
            <span className="font-semibold text-2xl mb-2 text-zinc-200 group-hover:text-blue-300 transition-all">
              Arrastra archivos aquí o haz clic para subir
            </span>
            <span className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-all">
              Soporta todos los tipos de archivo
            </span>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
            {uploading && (
              <div className="mt-4 flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                <span className="text-blue-400 font-medium">Subiendo archivo...</span>
              </div>
            )}
            {updating && !uploading && (
              <div className="mt-4 flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                <span className="text-blue-400 font-medium">Actualizando lista...</span>
              </div>
            )}
          </div>
        </div>

        {/* Contenedor principal */}
        <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-700/50 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header con breadcrumb */}
          <div className="bg-gradient-to-r from-zinc-800/80 to-zinc-700/80 px-8 py-6 border-b border-zinc-600/50">
            <div className="flex items-center justify-between">
              <Breadcrumb>
                <BreadcrumbList>
                  {([{name: "Archivos", isRoot: true}, ...currentPath.map(name => ({name, isRoot: false}))]).map((segment, idx, arr) => (
                    <React.Fragment key={`${segment.name}-${idx}`}>
                      <BreadcrumbItem>
                        {idx === arr.length - 1 ? (
                          <BreadcrumbPage className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                            {segment.isRoot && <FolderIcon className="w-5 h-5" />}
                            {segment.name}
                          </BreadcrumbPage>
                        ) : (
                          <button 
                            className="text-lg font-medium text-zinc-300 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2"
                            onClick={() => {
                              if (idx === 0) {
                                setCurrentPath([]);
                              } else {
                                setCurrentPath(currentPath.slice(0, idx));
                              }
                            }}
                          >
                            {segment.isRoot && <FolderIcon className="w-5 h-5" />}
                            {segment.name}
                          </button>
                        )}
                      </BreadcrumbItem>
                      {idx < arr.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-800/60 px-3 py-2 rounded-full border border-zinc-600/50">
                  <RefreshIcon />
                  <span>Sincronización automática</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controles de navegación */}
          <div className="flex items-center justify-between px-8 py-4 bg-zinc-800/30">
            <div className="flex items-center gap-4">
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-zinc-700/60 hover:bg-zinc-600/60 text-zinc-200 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-600/50" 
                onClick={goBack} 
                disabled={currentPath.length === 0}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Atrás
              </button>
              
              {selectedItems.size > 0 && (
                <div className="flex items-center gap-2 text-sm text-zinc-300 bg-blue-500/20 px-3 py-2 rounded-lg border border-blue-500/30">
                  <CheckIcon />
                  <span>{selectedItems.size} elemento(s) seleccionado(s)</span>
                </div>
              )}
            </div>
            
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-blue-600/80 hover:bg-blue-500/80 text-white rounded-xl transition-all duration-200 shadow-lg border border-blue-500/50" 
              onClick={() => setCreateFolderModal(true)}
            >
              <PlusIcon />
              Nueva carpeta
            </button>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="mx-8 mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Grid de archivos */}
          <DndProvider backend={HTML5Backend}>
            <div className="p-8">
              {loading && items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
                  <span className="text-zinc-400 text-lg">Cargando archivos...</span>
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                  <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mb-4 opacity-50">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7a2 2 0 012-2h4l2 3h8a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                  </svg>
                  <span className="text-xl font-medium">Esta carpeta está vacía</span>
                  <span className="text-sm mt-2">Sube archivos o crea una nueva carpeta</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {items
                    .filter(item => item.name !== '.gitkeep')
                    .map((item) => (
                    <DraggableFileCard key={item.name} item={item} onMove={handleMove}>
                      <div
                        className="relative bg-gradient-to-br from-zinc-800/60 to-zinc-900/60 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-4 min-h-[200px] flex flex-col justify-between items-center group hover:shadow-xl hover:border-zinc-600/70 transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                        onDoubleClick={() => handleDoubleClick(item)}
                      >
                        <div 
                          className="absolute top-3 left-3 w-5 h-5 rounded border-2 border-zinc-500 bg-zinc-800/80 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-all z-10 backdrop-blur-sm"
                          onClick={(e) => handleCheckboxClick(item.name, e)}
                        >
                          {selectedItems.has(item.name) && <CheckIcon />}
                        </div>

                        <div className="w-full flex flex-col items-center mt-2">
                          <div className="flex items-center justify-center w-full h-16 mb-4">
                            {getFileIcon(item.name, item.type)}
                          </div>
                          <span className="font-medium text-sm text-center text-zinc-200 line-clamp-2 max-w-full break-words px-2">
                            {item.name}
                          </span>
                        </div>
                        
                        <DropdownMenu onOpenChange={(open) => {
                          setDropdownOpen(open);
                          if (open) {
                            setIsInteracting(true);
                            if (interactionTimeoutRef.current) {
                              clearTimeout(interactionTimeoutRef.current);
                            }
                            interactionTimeoutRef.current = setTimeout(() => {
                              setIsInteracting(false);
                            }, 3000);
                          }
                        }}>
                          <DropdownMenuTrigger asChild>
                            <button 
                              className="absolute bottom-3 right-3 rounded-full p-2 bg-zinc-700/60 hover:bg-zinc-600/80 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm border border-zinc-600/50"
                            >
                              <DotsVerticalIcon />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" side="bottom" sideOffset={8} className="min-w-[200px] p-2 bg-zinc-800/95 backdrop-blur-sm border border-zinc-600/50 rounded-xl shadow-2xl">
                            <DropdownMenuLabel className="text-xs text-zinc-400 px-3 pb-2 font-medium">Acciones disponibles</DropdownMenuLabel>
                            
                            {item.type === "file" && (
                              <DropdownMenuItem className="flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-lg text-sm text-zinc-200 hover:bg-zinc-700/60 transition-all" onClick={() => handleDownload(item)}>
                                <DownloadIcon />
                                Descargar archivo
                              </DropdownMenuItem>
                            )}
                            
                            {item.type === "file" && isEditableFile(item.name) && (
                              <DropdownMenuItem className="flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-lg text-sm text-zinc-200 hover:bg-zinc-700/60 transition-all" onClick={() => handleOpenEdit(item)}>
                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-400">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Editar archivo
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuItem className="flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-lg text-sm text-zinc-200 hover:bg-zinc-700/60 transition-all" onClick={() => { 
                              setRenameModal({open: true, item}); 
                              const nameWithoutExt = item.name.includes('.') ? item.name.substring(0, item.name.lastIndexOf('.')) : item.name;
                              setNewName(nameWithoutExt);
                            }}>
                              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-yellow-400">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                              Cambiar nombre
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator className="my-2 bg-zinc-600/50" />
                            
                            <DropdownMenuItem className="flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/20 transition-all" onClick={() => setDeleteModal({open: true, item})}>
                              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </DraggableFileCard>
                  ))}
                </div>
              )}
            </div>
          </DndProvider>
        </div>
      </div>

      {/* Modales */}
      
      {/* Modal de cambiar nombre */}
      <Dialog open={renameModal.open} onOpenChange={v => {
        setRenameModal({open: v, item: v ? renameModal.item : null});
        if (v) handleUserInteraction();
      }}>
        <DialogContent className="bg-zinc-900/95 backdrop-blur-sm rounded-3xl p-8 max-w-md mx-auto border border-zinc-700/50 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-6 text-zinc-100">Cambiar nombre</DialogTitle>
          </DialogHeader>
          <div className="mb-6">
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Nuevo nombre"
              className="w-full px-4 py-3 rounded-xl border border-zinc-600/50 bg-zinc-800/60 text-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all backdrop-blur-sm"
              autoFocus
            />
            {renameModal.item && renameModal.item.name.includes('.') && (
              <p className="text-sm text-zinc-400 mt-3 bg-zinc-800/40 px-3 py-2 rounded-lg">
                💡 Extensión: .{renameModal.item.name.split('.').pop()} (se mantendrá automáticamente)
              </p>
            )}
          </div>
          <DialogFooter className="flex flex-row gap-3 justify-end">
            <button
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg disabled:opacity-50"
              onClick={handleRename}
              disabled={loading || !newName.trim()}
            >
              Cambiar nombre
            </button>
            <button
              className="px-6 py-3 rounded-xl bg-zinc-700/60 hover:bg-zinc-600/60 text-zinc-200 font-semibold border border-zinc-600/50 transition-all"
              onClick={() => setRenameModal({open: false, item: null})}
            >
              Cancelar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de edición */}
      <Dialog open={editModal.open} onOpenChange={v => {
        setEditModal({open: v, item: v ? editModal.item : null, content: v ? editModal.content : ""});
        if (v) handleUserInteraction();
      }}>
        <DialogContent className="bg-zinc-900/95 backdrop-blur-sm rounded-3xl p-8 max-w-4xl mx-auto border border-zinc-700/50 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-6 text-zinc-100">
              📝 Editar: {editModal.item?.name}
            </DialogTitle>
          </DialogHeader>
          <textarea
            value={editModal.content}
            onChange={e => setEditModal(m => ({...m, content: e.target.value}))}
            className="w-full h-80 px-4 py-3 rounded-xl border border-zinc-600/50 bg-zinc-800/60 text-base text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent mb-6 transition-all font-mono backdrop-blur-sm resize-none"
            spellCheck={false}
            placeholder="Contenido del archivo..."
          />
          <DialogFooter className="flex flex-row gap-3 justify-end">
            <button
              className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold transition-all shadow-lg disabled:opacity-50"
              onClick={handleSaveEdit}
              disabled={savingEdit}
            >
              {savingEdit ? 'Guardando...' : '💾 Guardar cambios'}
            </button>
            <button
              className="px-6 py-3 rounded-xl bg-zinc-700/60 hover:bg-zinc-600/60 text-zinc-200 font-semibold border border-zinc-600/50 transition-all"
              onClick={() => setEditModal({open: false, item: null, content: ""})}
            >
              Cancelar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para crear carpeta */}
      <Dialog open={createFolderModal} onOpenChange={v => {
        setCreateFolderModal(v);
        if (v) handleUserInteraction();
      }}>
        <DialogContent className="bg-zinc-900/95 backdrop-blur-sm rounded-3xl p-8 max-w-md mx-auto border border-zinc-700/50 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-6 text-zinc-100">📁 Crear nueva carpeta</DialogTitle>
          </DialogHeader>
          <input
            value={newFolderName}
            onChange={e => setNewFolderName(e.target.value)}
            placeholder="Nombre de la carpeta"
            className="w-full px-4 py-3 rounded-xl border border-zinc-600/50 bg-zinc-800/60 text-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent mb-6 transition-all backdrop-blur-sm"
            autoFocus
          />
          <DialogFooter className="flex flex-row gap-3 justify-end">
            <button
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg disabled:opacity-50"
              onClick={handleCreateFolder}
              disabled={creatingFolder || !newFolderName.trim()}
            >
              {creatingFolder ? 'Creando...' : '✨ Crear carpeta'}
            </button>
            <button
              className="px-6 py-3 rounded-xl bg-zinc-700/60 hover:bg-zinc-600/60 text-zinc-200 font-semibold border border-zinc-600/50 transition-all"
              onClick={() => setCreateFolderModal(false)}
            >
              Cancelar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmación de eliminación */}
      <Dialog open={deleteModal.open} onOpenChange={v => {
        setDeleteModal({open: v, item: v ? deleteModal.item : null});
        if (v) handleUserInteraction();
      }}>
        <DialogContent className="bg-zinc-900/95 backdrop-blur-sm rounded-3xl p-8 max-w-md mx-auto border border-zinc-700/50 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-6 text-zinc-100">🗑️ Confirmar eliminación</DialogTitle>
          </DialogHeader>
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
            <p className="text-zinc-200 mb-2">
              ¿Estás seguro de que quieres eliminar <strong>"{deleteModal.item?.name}"</strong>?
            </p>
            <p className="text-red-300 text-sm">
              ⚠️ Esta acción no se puede deshacer.
            </p>
          </div>
          <DialogFooter className="flex flex-row gap-3 justify-end">
            <button
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold transition-all shadow-lg disabled:opacity-50"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Eliminando...' : '🗑️ Eliminar definitivamente'}
            </button>
            <button
              className="px-6 py-3 rounded-xl bg-zinc-700/60 hover:bg-zinc-600/60 text-zinc-200 font-semibold border border-zinc-600/50 transition-all"
              onClick={() => setDeleteModal({open: false, item: null})}
            >
              Cancelar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para mostrar imágenes */}
      <Dialog open={imageModal.open} onOpenChange={v => {
        setImageModal({open: v, item: v ? imageModal.item : null, imageUrl: v ? imageModal.imageUrl : ""});
        if (v) handleUserInteraction();
      }}>
        <DialogContent className="bg-zinc-900/95 backdrop-blur-sm rounded-3xl p-8 max-w-5xl mx-auto border border-zinc-700/50 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-6 text-zinc-100">
              🖼️ {imageModal.item?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center bg-zinc-800/40 rounded-2xl p-4">
            <img 
              src={imageModal.imageUrl} 
              alt={imageModal.item?.name}
              className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDEyVjdBMiAyIDAgMCAwIDE5IDVINUEyIDIgMCAwIDAgMyA3VjE3QTIgMiAwIDAgMCA1IDE5SDE5QTIgMiAwIDAgMCAyMSAxN1YxMloiIHN0cm9rZT0iIzk5OTk5OSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPGNpcmNsZSBjeD0iOC41IiBjeT0iMTAuNSIgcj0iMS41IiBzdHJva2U9IiM5OTk5OTkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0yMSAxOUw2IDEyTDMgMTciIHN0cm9rZT0iIzk5OTk5OSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+';
              }}
            />
          </div>
          <DialogFooter className="flex flex-row gap-3 justify-end mt-6">
            <button
              className="px-6 py-3 rounded-xl bg-zinc-700/60 hover:bg-zinc-600/60 text-zinc-200 font-semibold border border-zinc-600/50 transition-all"
              onClick={() => setImageModal({open: false, item: null, imageUrl: ""})}
            >
              Cerrar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
