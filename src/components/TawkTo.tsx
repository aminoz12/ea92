import { useEffect } from 'react'

export function TawkTo() {
  useEffect(() => {
    // Check if Tawk.to is already loaded
    if (window.Tawk_API) {
      return
    }

    // Tawk.to configuration
    window.Tawk_API = window.Tawk_API || {}
    window.Tawk_LoadStart = new Date()

    // Create and configure the script
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://embed.tawk.to/68df44c928fea3194d8c3dd7/1j6k29cva'
    script.charset = 'UTF-8'
    script.setAttribute('crossorigin', '*')
    
    // Add the script to the document
    const s0 = document.getElementsByTagName('script')[0]
    if (s0 && s0.parentNode) {
      s0.parentNode.insertBefore(script, s0)
    } else {
      document.head.appendChild(script)
    }

    // Configure Tawk.to settings
    window.Tawk_API.customStyle = {
      zIndex: 1000,
    }

    // Set up custom attributes
    window.Tawk_API.setAttributes = {
      name: 'Espace Auto 92',
      email: 'Espaceauto92.contact@gmail.com',
      hash: '68df44c928fea3194d8c3dd7'
    }

    // Cleanup function
    return () => {
      const existingScript = document.querySelector('script[src*="tawk.to"]')
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [])

  return null // This component doesn't render anything
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    Tawk_API: {
      showWidget: () => void;
      hideWidget: () => void;
      toggle: () => void;
      customStyle?: any;
      setAttributes?: any;
    }
    Tawk_LoadStart: Date
  }
}
