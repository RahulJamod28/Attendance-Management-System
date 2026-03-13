// QR Scanning Logic
let cachedLocation = { lat: null, lon: null, timestamp: 0 };

function updateLocationCache() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            cachedLocation = {
                lat: position.coords.latitude,
                lon: position.coords.longitude,
                timestamp: Date.now()
            };
        }, null, { enableHighAccuracy: true });
    }
}

function onScanSuccess(decodedText, decodedResult) {
    const resultDiv = document.getElementById('scan-result');
    resultDiv.innerText = "⚡ Processing...";
    
    // Use cached location if fresh (less than 30s old), else get new one
    if (cachedLocation.lat && (Date.now() - cachedLocation.timestamp < 30000)) {
        sendAttendance(decodedText, cachedLocation.lat, cachedLocation.lon);
    } else if (navigator.geolocation) {
        resultDiv.innerText = "🛰️ Verifying location...";
        navigator.geolocation.getCurrentPosition((position) => {
            sendAttendance(decodedText, position.coords.latitude, position.coords.longitude);
        }, () => sendAttendance(decodedText, null, null), { enableHighAccuracy: true });
    } else {
        sendAttendance(decodedText, null, null);
    }
}

function sendAttendance(token, lat, lon) {
    fetch('/api/mark-attendance/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ 
            token: token,
            latitude: lat,
            longitude: lon
        })
    })
    .then(response => response.json())
    .then(data => {
        const resultDiv = document.getElementById('scan-result');
        resultDiv.innerText = data.message;
        
        if (data.status === 'success') {
            resultDiv.className = 'scan-result scan-success';
        } else {
            resultDiv.className = 'scan-result scan-error';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function onScanFailure(error) {
    // Keep scanning
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('reader')) {
        // Pre-fetch location immediately
        updateLocationCache();
        
        let html5QrcodeScanner = new Html5QrcodeScanner(
            "reader",
            { 
                fps: 25, 
                qrbox: {width: 250, height: 250},
                supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
            },
            /* verbose= */ false);
        html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    }
});
