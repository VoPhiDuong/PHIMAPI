# Test API endpoints structure
$featured = Invoke-RestMethod -Uri 'https://phimapi.com/danh-sach/phim-moi-cap-nhat-v3?page=1'
$new = Invoke-RestMethod -Uri 'https://phimapi.com/danh-sach/phim-moi-cap-nhat-v2?page=1'

Write-Host "Featured Movies (v3) structure:"
if ($featured.items) {
    Write-Host "- Has direct 'items' property"
} elseif ($featured.data.items) {
    Write-Host "- Has 'data.items' property"
} else {
    Write-Host "- Structure: $($featured | Get-Member -MemberType Properties | Select-Object -ExpandProperty Name)"
}

Write-Host "\nNew Movies (v2) structure:"
if ($new.items) {
    Write-Host "- Has direct 'items' property"
} elseif ($new.data.items) {
    Write-Host "- Has 'data.items' property"
} else {
    Write-Host "- Structure: $($new | Get-Member -MemberType Properties | Select-Object -ExpandProperty Name)"
}