import React, { useState, useCallback, useEffect } from 'react';
import { TextField, Box, Typography, Snackbar, IconButton, Button, ToggleButtonGroup, ToggleButton, Tooltip } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import ColorLensIcon from '@mui/icons-material/ColorLens';

const flowerImages = [
  'https://cdn.pixabay.com/photo/2016/03/16/21/25/chamomile-1261796_1280.jpg',
  'https://cdn.pixabay.com/photo/2020/05/28/19/01/daisies-5232284_1280.jpg',
  'https://cdn.pixabay.com/photo/2024/02/13/22/20/flower-meadow-8572000_960_720.jpg',
  'https://cdn.pixabay.com/photo/2018/05/23/23/10/daisies-3425426_1280.jpg',
  'https://cdn.pixabay.com/photo/2020/05/04/07/49/flower-5128200_1280.jpg'
];

const primaryColor = '#F9A825';
const secondaryColor = '#FFF9C4';
const textColor = '#FFFFFF';

const buttonStyle = {
  borderRadius: '12px',
  padding: '12px',
  backgroundColor: primaryColor,
  color: textColor,
  fontFamily: "'Kanit', sans-serif",
  fontWeight: 'bold',
  fontSize: '16px',
  textTransform: 'none',
  marginBottom: '20px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: secondaryColor,
    color: primaryColor,
    boxShadow: `0 4px 8px ${primaryColor}4D`,
    transform: 'translateY(-2px)',
  },
};

function App() {
  const [url, setUrl] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [qrSize, setQrSize] = useState('medium');
  const [qrColor, setQrColor] = useState(primaryColor);
  const [backgroundImage, setBackgroundImage] = useState(flowerImages[0]);

  const getRandomImage = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * flowerImages.length);
    return flowerImages[randomIndex];
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundImage(getRandomImage());
    }, 10000);

    return () => clearInterval(interval);
  }, [getRandomImage]);

  const handleGenerateClick = useCallback(() => {
    if (url.trim() !== '') {
      setQrCode(url);
      setSnackbarMessage('QR Code สร้างเรียบร้อยแล้ว');
      setOpenSnackbar(true);
    } else {
      setSnackbarMessage('กรุณากรอก URL');
      setOpenSnackbar(true);
    }
  }, [url]);

  const handleCopyClick = useCallback(() => {
    navigator.clipboard.writeText(url);
    setSnackbarMessage('คัดลอก URL สำเร็จ');
    setOpenSnackbar(true);
  }, [url]);

  const handleDownload = useCallback(() => {
    const svg = document.getElementById('qr-code');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'floral_qrcode.png';
      downloadLink.href = pngFile;
      downloadLink.click();
      setSnackbarMessage('ดาวน์โหลด QR Code สำเร็จ');
      setOpenSnackbar(true);
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  }, []);

  const handleSizeChange = useCallback((event, newSize) => {
    if (newSize !== null) {
      setQrSize(newSize);
    }
  }, []);

  const getQrSize = () => {
    switch (qrSize) {
      case 'small': return 120;
      case 'large': return 240;
      default: return 180;
    }
  };

  return (
    <Box
      className="min-h-screen flex items-center justify-center p-4 sm:p-6"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transition: 'background-image 1s ease-in-out',
      }}
    >
      <Box
        className="p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl relative overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${primaryColor}`,
          boxShadow: `0 10px 30px ${primaryColor}4D`,
        }}
      >
        <TextField
          fullWidth
          label="กรอก URL"
          variant="outlined"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          sx={{
            marginBottom: '20px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              fontFamily: "'Kanit', sans-serif",
              '& fieldset': {
                borderColor: primaryColor,
              },
              '&:hover fieldset': {
                borderColor: primaryColor,
              },
              '&.Mui-focused fieldset': {
                borderColor: primaryColor,
              },
            },
            '& .MuiInputLabel-root': {
              fontFamily: "'Kanit', sans-serif",
              color: primaryColor,
              '&.Mui-focused': {
                color: primaryColor,
              },
            },
          }}
        />
        <Button
          fullWidth
          variant="contained"
          onClick={handleGenerateClick}
          sx={buttonStyle}
        >
          สร้าง QR Code
        </Button>

        <Box className="flex justify-center mb-6">
          <ToggleButtonGroup
            value={qrSize}
            exclusive
            onChange={handleSizeChange}
            aria-label="QR code size"
            style={{
              display: 'flex',
              width: '100%',
              maxWidth: '300px',
            }}
          >
            {[
              { value: 'small', label: 'เล็ก' },
              { value: 'medium', label: 'กลาง' },
              { value: 'large', label: 'ใหญ่' }
            ].map(({ value, label }) => (
              <ToggleButton
                key={value}
                value={value}
                aria-label={value}
                sx={{
                  flex: 1,
                  borderRadius: '8px',
                  color: qrSize === value ? primaryColor : textColor,
                  backgroundColor: qrSize === value ? secondaryColor : primaryColor,
                  transition: 'all 0.3s ease',
                  fontWeight: 'bold',
                  border: `1px solid ${primaryColor}`,
                  padding: '8px 0',
                  minWidth: 0,
                  fontFamily: "'Kanit', sans-serif",
                  '&:hover': {
                    backgroundColor: qrSize === value ? secondaryColor : `${primaryColor}CC`,
                    boxShadow: `0 2px 4px ${primaryColor}4D`,
                  },
                }}
              >
                {label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        <Box className="flex justify-center items-center mb-6">
          <Tooltip title="เลือกสี QR Code" arrow>
            <IconButton
              onClick={() => document.getElementById('colorPicker').click()}
              sx={{
                color: primaryColor,
                '&:hover': {
                  backgroundColor: `${secondaryColor}4D`,
                },
              }}
            >
              <ColorLensIcon />
            </IconButton>
          </Tooltip>
          <input
            id="colorPicker"
            type="color"
            value={qrColor}
            onChange={(e) => setQrColor(e.target.value)}
            style={{ display: 'none' }}
          />
          <Typography variant="body2" style={{ marginLeft: '10px', fontFamily: "'Kanit', sans-serif", color: primaryColor }}>
            สีที่เลือก:
          </Typography>
          <Box
            sx={{
              width: '20px',
              height: '20px',
              backgroundColor: qrColor,
              marginLeft: '5px',
              border: '1px solid #000',
              borderRadius: '4px'
            }}
          />
        </Box>

        {qrCode && (
          <Box className="flex justify-center mb-6">
            <Box
              className="relative"
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '50px',
                boxShadow: `0 4px 20px ${primaryColor}4D`,
                border: `1px solid ${primaryColor}`,
              }}
            >
              <QRCodeSVG id="qr-code" value={qrCode} size={getQrSize()} fgColor={qrColor} className="rounded-lg" />
              <Box className="absolute top-2 right-2 flex space-x-2">
                <Tooltip title="คัดลอก URL" arrow>
                  <IconButton
                    onClick={handleCopyClick}
                    size="small"
                    sx={{
                      backgroundColor: secondaryColor,
                      color: primaryColor,
                      '&:hover': {
                        backgroundColor: primaryColor,
                        color: textColor,
                      },
                    }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="ดาวน์โหลด QR Code" arrow>
                  <IconButton
                    onClick={handleDownload}
                    size="small"
                    sx={{
                      backgroundColor: secondaryColor,
                      color: primaryColor,
                      '&:hover': {
                        backgroundColor: primaryColor,
                        color: textColor,
                      },
                    }}
                  >
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
        ContentProps={{
          style: {
            background: secondaryColor,
            color: primaryColor,
            fontWeight: 'bold',
            borderRadius: '8px',
            padding: '10px 20px',
            fontFamily: "'Kanit', sans-serif",
          }
        }}
      />
    </Box>
  );
}

export default App;