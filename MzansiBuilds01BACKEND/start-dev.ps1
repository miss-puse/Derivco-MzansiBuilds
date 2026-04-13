param(
  [int]$Port = 8081
)

$listener = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if ($listener) {
  Write-Host "Stopping process $($listener.OwningProcess) on port $Port..."
  Stop-Process -Id $listener.OwningProcess -Force -ErrorAction SilentlyContinue
}

Write-Host "Starting backend on port $Port..."
mvn spring-boot:run "-Dspring-boot.run.arguments=--server.port=$Port"
