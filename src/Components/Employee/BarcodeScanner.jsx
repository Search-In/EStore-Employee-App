import { Button } from "@mui/material"
import { Html5Qrcode } from "html5-qrcode"
import { useEffect, useRef, useState } from "react"

function EmployeeScanner({
  handleScan,
  scanResult,
  setScanResult,
  setIsScanning,
  isScanning,
}) {
  const [scanner, setScanner] = useState(null)
  // const [isScanning, setIsScanning] = useState(false)
  const readerRef = useRef(null)

  const getQrBoxSize = () => {
    if (readerRef.current) {
      const width = readerRef.current.clientWidth
      const height = readerRef.current.clientHeight
      console.log("math ", Math.min(width, height) * 0.8)
      return `${Math.min(width, height) * 0.8}`
    }
    console.log("250")
    return 250
  }

  const handleScanner = async () => {
    if (isScanning) {
      scanner
        .stop()
        .then(() => {
          console.log("Scanner stopped.")
          setIsScanning(false)
        })
        .catch((err) => {
          console.log("Failed to stop scanner: ", err)
        })
    } else {
      try {
        const devices = await Html5Qrcode.getCameras()
        if (devices && devices.length) {
          const backCamera = devices.find((device) =>
            device.label.toLowerCase().includes("back")
          )
          const frontCamera = devices.find((device) =>
            device.label.toLowerCase().includes("front")
          )
          const cameraId = backCamera
            ? backCamera.id
            : frontCamera
            ? frontCamera.id
            : devices[0].id
          //   const cameraId = devices[0].id; // Use the first available camera
          const html5QrCode = new Html5Qrcode(readerRef.current.id)

          await html5QrCode.start(
            cameraId,
            {
              fps: 10,
              qrbox: {
                width: getQrBoxSize(),
                height: getQrBoxSize(),
              },
              // qrbox: getQrBoxSize(),
            },
            (decodedText) => {
              setScanResult(decodedText)
              console.log(`QR Code detected: ${decodedText}`)
            },
            (errorMessage) => {
              //   console.log(`QR Code scanning error: ${errorMessage}`);
            }
          )

          setScanner(html5QrCode)
          setIsScanning(true)
        } else {
          console.log("No cameras found.")
        }
      } catch (error) {
        console.log("Error starting scanner: ", error)
      }
    }
  }

  useEffect(() => {
    if (scanResult) {
      async function fetchData() {
        if (scanResult) {
          handleScan(scanResult)
        }
      }
      fetchData()
    }
  }, [scanResult])

  // useEffect(() => {
  //   return () => {
  //     const stopScanner = async () => {
  //       if (scanner && isScanning) {
  //         try {
  //           await scanner.stop()
  //           console.log("Scanner stopped.")
  //           setIsScanning(false)
  //         } catch (err) {
  //           console.log("Failed to stop scanner: ", err)
  //         }
  //       }
  //     }
  //     stopScanner()
  //   }
  // }, [scanner, isScanning])

  return (
    <>
      <div
        id="reader"
        ref={readerRef}
        style={{ width: "100%", height: "156%" }}
      ></div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleScanner}
        sx={{
          backgroundColor: isScanning ? "#E40101" : "#5EC401",
          color: "#fff",
          textTransform: "none",
          fontSize: "18px",
          fontFamily: "Poppins",
          "&.MuiButtonBase-root:hover": {
            backgroundColor: isScanning ? "#C40000" : "#64cf00",
          },
          position: "absolute",
          top: 150,
          left: "85%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        {isScanning ? "Stop" : "Start"}
      </Button>
    </>
  )
}

export default EmployeeScanner
