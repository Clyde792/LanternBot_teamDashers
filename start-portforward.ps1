while ($true) {
    kubectl port-forward service/reachout-bot-service 3001:80 -n reachout --address 0.0.0.0
    Write-Host "Port-forward dropped, restarting in 2 seconds..."
    Start-Sleep -Seconds 2
}