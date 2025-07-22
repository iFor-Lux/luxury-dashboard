"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { UserManagement } from "@/components/user-management"
import { UserList } from "@/components/user-list"
import { NotificationSender } from "@/components/notification-sender"
import { UpdateSender } from "@/components/update-sender"
import { ThemeToggle } from "@/components/theme-toggle"
import { useFirebaseAuth } from "@/hooks/use-firebase-auth"
import type { User } from "@/types/user"
import { database } from "@/lib/firebase"
import { ref, onValue } from "firebase/database"
import { AlertCircle, Wifi, WifiOff, Shield, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import FileManager from "@/components/file-manager"

export default function Dashboard() {
  const { user: authUser, loading: authLoading, error: authError, isAuthenticated } = useFirebaseAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(true)
  const [tabValue, setTabValue] = useState("create")

  useEffect(() => {
    if (!isAuthenticated || authLoading) {
      return
    }

    let unsubscribe: (() => void) | null = null

    const setupFirebaseListener = () => {
      try {
        console.log("Configurando listener de Firebase...")
        const usersRef = ref(database, "users")

        unsubscribe = onValue(
          usersRef,
          (snapshot) => {
            console.log("Datos de Firebase recibidos")
            const data = snapshot.val()
            if (data) {
              const usersList = Object.entries(data).map(([id, userData]: [string, any]) => ({
                id,
                ...userData,
              }))
              setUsers(usersList)
              console.log(`Cargados ${usersList.length} usuarios`)
            } else {
              setUsers([])
              console.log("No se encontraron usuarios")
            }
            setLoading(false)
            setError(null)
            setIsConnected(true)
          },
          (error: any) => {
            console.error("Error obteniendo usuarios:", error)
            let errorMessage = "Error de conexión desconocido"

            // Type assertion for Firebase error
            const firebaseError = error as { code?: string; message: string }
            
            if (firebaseError.code === "PERMISSION_DENIED") {
              errorMessage = "Permisos denegados. Verificando configuración de Firebase..."
            } else if (firebaseError.code === "NETWORK_ERROR") {
              errorMessage = "Error de red. Verifica tu conexión a internet."
            } else {
              errorMessage = `Error: ${firebaseError.message}`
            }

            setError(errorMessage)
            setLoading(false)
            setIsConnected(false)
          },
        )
      } catch (error) {
        console.error("Error configurando listener de Firebase:", error)
        setError(`Error de configuración: ${error instanceof Error ? error.message : "Error desconocido"}`)
        setLoading(false)
        setIsConnected(false)
      }
    }

    setupFirebaseListener()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [isAuthenticated, authLoading])

  const retryConnection = () => {
    setLoading(true)
    setError(null)
    window.location.reload()
  }

  // Mostrar loading mientras se autentica
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Conectando con Firebase...</h2>
          <p className="text-muted-foreground">Autenticando y configurando permisos</p>
        </div>
      </div>
    )
  }

  // Mostrar error de autenticación
  if (authError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Error de Autenticación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{authError}</p>
            <Button onClick={() => window.location.reload()} className="w-full btn-primary">
              Reintentar Conexión
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 mt-6 sm:mt-8">
          {/* SOLO EN MÓVIL: Título centrado */}
          <h1 className="text-2xl sm:text-3xl font-bold luxury-logo mb-2 text-center sm:text-left">Luxury Dashboard Admin</h1>
          {/* SOLO EN MÓVIL: Grid para descripción y estados */}
          <div className="grid grid-cols-1 sm:flex sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-muted-foreground text-base sm:text-lg mb-0 sm:mb-0 col-span-1 sm:col-auto text-center sm:text-left">Panel de administración para gestionar usuarios y notificaciones</p>
            <div className="flex flex-row justify-center sm:justify-end items-center gap-2 sm:gap-4 mt-2 sm:mt-0 col-span-1 sm:col-auto">
              <ThemeToggle />
              {isAuthenticated && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm">Autenticado</span>
                </div>
              )}
              {isConnected ? (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <Wifi className="h-4 w-4" />
                  <span className="text-sm">Conectado</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <WifiOff className="h-4 w-4" />
                  <span className="text-sm">Desconectado</span>
                </div>
              )}
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4 alert-error">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Error de conexión</p>
                  <p className="text-sm">{error}</p>
                  {error.includes("PERMISSION_DENIED") && (
                    <p className="text-xs mt-2">
                      💡 Solución: Ve a Firebase Console → Realtime Database → Rules y configura las reglas de seguridad
                    </p>
                  )}
                </div>
                <Button onClick={retryConnection} variant="outline" size="sm" className="interactive-element">
                  Reintentar
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Select solo en móvil, ahora con diseño moderno */}
        <div className="sm:hidden mb-4">
          <Select value={tabValue} onValueChange={setTabValue}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona una sección" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="create">Crear Usuario</SelectItem>
              <SelectItem value="users">Gestión de Usuarios</SelectItem>
              <SelectItem value="notifications">Notificaciones</SelectItem>
              <SelectItem value="updates">Updates</SelectItem>
              <SelectItem value="files">Archivos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Tabs value={tabValue} onValueChange={setTabValue} className="space-y-4">
          <TabsList className="hidden sm:grid w-full grid-cols-5">
            <TabsTrigger value="create" className="interactive-element">Crear Usuario</TabsTrigger>
            <TabsTrigger value="users" className="interactive-element">Gestión de Usuarios</TabsTrigger>
            <TabsTrigger value="notifications" className="interactive-element">Notificaciones</TabsTrigger>
            <TabsTrigger value="updates" className="interactive-element">Updates</TabsTrigger>
            <TabsTrigger value="files" className="interactive-element">Archivos</TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Sección 1: Crear Nuevo Usuario</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Crea nuevos usuarios con credenciales personalizadas y fecha de vencimiento
                </p>
              </CardHeader>
              <CardContent>
                {isAuthenticated && isConnected ? (
                  <UserManagement />
                ) : (
                  <Alert variant="destructive" className="alert-error">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {!isAuthenticated
                        ? "Esperando autenticación con Firebase..."
                        : "No hay conexión con Firebase. No se pueden crear usuarios."}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Sección 2: Gestión de Usuarios</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Visualiza, edita y elimina usuarios registrados en la aplicación móvil
                </p>
              </CardHeader>
              <CardContent>
                {isAuthenticated && isConnected ? (
                  <UserList users={users} loading={loading} />
                ) : (
                  <Alert variant="destructive" className="alert-error">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {!isAuthenticated
                        ? "Esperando autenticación con Firebase..."
                        : "No hay conexión con Firebase. Los datos no se pueden cargar."}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Sección 3: Enviar Notificaciones</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Envía notificaciones push o mensajes in-app a los usuarios de la aplicación móvil
                </p>
              </CardHeader>
              <CardContent>
                {isAuthenticated && isConnected ? (
                  <NotificationSender />
                ) : (
                  <Alert variant="destructive" className="alert-error">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {!isAuthenticated
                        ? "Esperando autenticación con Firebase..."
                        : "No hay conexión con Firebase. Las notificaciones no se pueden enviar."}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="updates">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Sección 4: Enviar Updates</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Notifica a los usuarios sobre nuevas versiones disponibles de la aplicación
                </p>
              </CardHeader>
              <CardContent>
                {isAuthenticated && isConnected ? (
                  <UpdateSender />
                ) : (
                  <Alert variant="destructive" className="alert-error">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {!isAuthenticated
                        ? "Esperando autenticación con Firebase..."
                        : "No hay conexión con Firebase. Los updates no se pueden enviar."}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Sección 5: Archivos</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Aquí podrás gestionar archivos (subir, ver, eliminar, etc.)
                </p>
              </CardHeader>
              <CardContent>
                <FileManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
