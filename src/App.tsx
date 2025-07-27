import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import "./App.css"

declare global {
  interface Window {
    ethereum?: import("ethers").Eip1193Provider & {
      isMetaMask?: boolean
    }
  }
}

function App() {
  const [metamaskConnected, setMetamaskConnected] = useState(false)
  const [ethereumAddress, setEthereumAddress] = useState<string>("")
  const [message, setMessage] = useState("")
  const [signature, setSignature] = useState<string>("")
  const [signatureR, setSignatureR] = useState<number[]>([])
  const [signatureS, setSignatureS] = useState<number[]>([])
  const [recoveryId, setRecoveryId] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [copyStates, setCopyStates] = useState<Record<string, boolean>>({})

  useEffect(() => {
    checkMetamaskConnection()
  }, [])

  const checkMetamaskConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        })
        if (accounts.length > 0) {
          setMetamaskConnected(true)
          setEthereumAddress(accounts[0])
        }
      } catch (error) {
        console.error("Error checking MetaMask connection:", error)
      }
    }
  }

  const connectMetamask = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        setMetamaskConnected(true)
        setEthereumAddress(accounts[0])
      } catch (error) {
        console.error("Error connecting to MetaMask:", error)
      }
    } else {
      alert("MetaMask is not installed!")
    }
  }

  const signMessage = async () => {
    if (!metamaskConnected) {
      alert("Please connect MetaMask first")
      return
    }

    if (!window.ethereum) {
      alert("MetaMask is not available")
      return
    }

    try {
      setLoading(true)
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      const signature = await signer.signMessage(message)
      setSignature(signature)

      const sigBytes = ethers.getBytes(signature)
      const r = Array.from(sigBytes.slice(0, 32)) as number[]
      const s = Array.from(sigBytes.slice(32, 64)) as number[]
      const v = sigBytes[64]

      const recovery_id = v - 27

      setSignatureR(r)
      setSignatureS(s)
      setRecoveryId(recovery_id)

      console.log("Signature components:")
      console.log("Message:", message)
      console.log("Full signature:", signature)
      console.log("r:", r)
      console.log("s:", s)
      console.log("recovery_id:", recovery_id)
    } catch (error) {
      console.error("Error signing message:", error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopyStates((prev) => ({ ...prev, [key]: true }))
      setTimeout(() => {
        setCopyStates((prev) => ({ ...prev, [key]: false }))
      }, 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 dark">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            MetaMask Signature Generator
          </h1>
          <p className="text-lg text-gray-300">
            Sign a message with MetaMask and get signature components
          </p>
        </div>

        <div className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Connect MetaMask
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!metamaskConnected ? (
                <Button onClick={connectMetamask} className="w-full">
                  Connect MetaMask
                </Button>
              ) : (
                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className="bg-green-900 text-green-300 border-green-700"
                  >
                    ✅ Connected
                  </Badge>
                  <span className="text-sm text-gray-300 font-mono">
                    {ethereumAddress}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                Enter Message to Sign
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter message to sign"
                className="w-full bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
              />
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                Sign Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button
                onClick={signMessage}
                disabled={!metamaskConnected || loading}
                className="w-full"
              >
                {loading ? "Signing..." : "Sign Message"}
              </Button>

              {signature && (
                <div className="space-y-4">
                  <Separator className="bg-gray-700" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600">
                      <div className="flex-1 mr-4">
                        <p className="text-sm font-medium text-gray-300 mb-1">
                          Message
                        </p>
                        <p className="text-sm text-white font-mono break-all">
                          {message}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(message, "message")}
                        className="border-gray-600 text-gray-300 hover:bg-gray-600"
                      >
                        {copyStates["message"] ? "Copied!" : "Copy"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600">
                      <div className="flex-1 mr-4">
                        <p className="text-sm font-medium text-gray-300 mb-1">
                          Full Signature
                        </p>
                        <p className="text-sm text-white font-mono break-all">
                          {signature}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(signature, "signature")}
                        className="border-gray-600 text-gray-300 hover:bg-gray-600"
                      >
                        {copyStates["signature"] ? "Copied!" : "Copy"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600">
                      <div className="flex-1 mr-4">
                        <p className="text-sm font-medium text-gray-300 mb-1">
                          Signature R
                        </p>
                        <p className="text-sm text-white font-mono break-all">
                          [{signatureR.join(", ")}]
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          copyToClipboard(
                            `[${signatureR.join(", ")}]`,
                            "signatureR"
                          )
                        }
                        className="border-gray-600 text-gray-300 hover:bg-gray-600"
                      >
                        {copyStates["signatureR"] ? "Copied!" : "Copy"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600">
                      <div className="flex-1 mr-4">
                        <p className="text-sm font-medium text-gray-300 mb-1">
                          Signature S
                        </p>
                        <p className="text-sm text-white font-mono break-all">
                          [{signatureS.join(", ")}]
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          copyToClipboard(
                            `[${signatureS.join(", ")}]`,
                            "signatureS"
                          )
                        }
                        className="border-gray-600 text-gray-300 hover:bg-gray-600"
                      >
                        {copyStates["signatureS"] ? "Copied!" : "Copy"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600">
                      <div className="flex-1 mr-4">
                        <p className="text-sm font-medium text-gray-300 mb-1">
                          Recovery ID
                        </p>
                        <p className="text-sm text-white font-mono">
                          {recoveryId}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          copyToClipboard(recoveryId.toString(), "recoveryId")
                        }
                        className="border-gray-600 text-gray-300 hover:bg-gray-600"
                      >
                        {copyStates["recoveryId"] ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default App
