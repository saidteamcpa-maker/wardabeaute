$outDir = "C:\Users\said\Documents\warda beaute\frontend\public\images"

$silkstop = "https://messages-prod.27c852f3500f38c1e7786e2c9ff9e48f.r2.cloudflarestorage.com/01a04e14-20c9-7529-8f60-aed08b6895f4/1788018230524-01a04e2f-f03d-7f63-8c5c-d1f2d62c0fc2.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=b33de61d4f22a31b59b25364ab5037c5%2F20260829%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260829T154350Z&X-Amz-Expires=3600&X-Amz-Signature=15be9cb767841de07c1345cde52dc03da5f48b885896e680c84e1a8cede584c6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"

$collaglow = "https://messages-prod.27c852f3500f38c1e7786e2c9ff9e48f.r2.cloudflarestorage.com/019d1ce8-06cf-7fec-a0d6-fd8ac8106af3/1788014842991-01a04dfb-d536-751b-b92b-aa69b3fcd66a.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=b33de61d4f22a31b59b25364ab5037c5%2F20260829%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260829T155024Z&X-Amz-Expires=3600&X-Amz-Signature=18ae14caf7a9e22c59693505dcfb29f4c3b9d8013ee10874c60b5a63df605ebb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"

$velvastretch = "https://chatgpt.com/backend-api/estuary/content?id=file_0000000005c8820a871a60df847063cb&ts=496671&p=fs&cid=1&sig=6fc9420b89b1576134c200ef5eeb2c0e496355ccaeb485a934c853a4c13218c0&v=0"

Write-Host "Downloading SilkStop..."
Invoke-WebRequest -Uri $silkstop -OutFile "$outDir\silkstop.jpeg" -UseBasicParsing
Write-Host "SilkStop done. Size: $((Get-Item "$outDir\silkstop.jpeg").Length) bytes"

Write-Host "Downloading CollaGlow..."
Invoke-WebRequest -Uri $collaglow -OutFile "$outDir\collaglow.jpeg" -UseBasicParsing
Write-Host "CollaGlow done. Size: $((Get-Item "$outDir\collaglow.jpeg").Length) bytes"

Write-Host "Downloading VelvaStretch..."
Invoke-WebRequest -Uri $velvastretch -OutFile "$outDir\velvastretch.jpeg" -UseBasicParsing
Write-Host "VelvaStretch done. Size: $((Get-Item "$outDir\velvastretch.jpeg").Length) bytes"
