# Test API response structure
$response = Invoke-WebRequest -Uri 'https://phimapi.com/v1/api/the-loai/hanh-dong?page=1&limit=5' -Method GET
$json = $response.Content | ConvertFrom-Json

Write-Host "Response structure:"
$json | Get-Member

Write-Host "`nData structure:"
$json.data | Get-Member

Write-Host "`nItems count:"
$json.data.items.Count

Write-Host "`nFirst item:"
$json.data.items[0] | ConvertTo-Json -Depth 2