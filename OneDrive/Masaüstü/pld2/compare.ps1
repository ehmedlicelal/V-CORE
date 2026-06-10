$dir1 = "c:\Users\ehmed\OneDrive\Masaüstü\pld2\pld-management-app"
$dir2 = "c:\Users\ehmed\OneDrive\Masaüstü\pld2\pld-management-app-new-main\pld-management-app-new-main"
$files2 = Get-ChildItem -Path $dir2 -Recurse -File | Where-Object { $_.FullName -notmatch '\\node_modules\\' -and $_.FullName -notmatch '\\\.git\\' }
$report = @()
foreach ($f in $files2) {
    $rel = $f.FullName.Substring($dir2.Length)
    $f1 = $dir1 + $rel
    if (!(Test-Path $f1)) {
        $report += "Added: $rel"
    } else {
        $hash1 = (Get-FileHash $f1).Hash
        $hash2 = (Get-FileHash $f.FullName).Hash
        if ($hash1 -ne $hash2) {
            $report += "Modified: $rel"
        }
    }
}
$report | Out-File -FilePath "$dir1\diff_report.txt" -Encoding utf8
