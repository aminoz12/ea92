# Tawk.to Setup Guide for EspaceAuto92

## 🚀 Quick Setup Steps:

### 1. Create Tawk.to Account
1. Go to [https://www.tawk.to](https://www.tawk.to)
2. Click "Sign Up Free"
3. Create your account with your business email
4. Choose "Website" as your platform

### 2. Get Your Widget Code
1. After signing up, you'll get a dashboard
2. Go to "Administration" → "Channels" → "Chat Widget"
3. Copy your **Property ID** and **Widget ID**
4. Replace in the code:
   ```typescript
   // In src/components/TawkTo.tsx, line 17:
   script.src = 'https://embed.tawk.to/YOUR-PROPERTY-ID/YOUR-WIDGET-ID'
   ```

### 3. Customize Your Chat Widget

#### Widget Appearance:
- **Colors**: Match your brand (Red: #DC2626, White: #FFFFFF)
- **Position**: Bottom right corner
- **Language**: French (fr)

#### Auto-Responses to Set Up:
```
Bonjour! 👋 Bienvenue chez EspaceAuto92. Comment puis-je vous aider aujourd'hui?

🕒 Horaires: Lun-Ven 8h-18h, Sam 8h-12h
📍 Adresse: 426 Avenue de la République, 92000 Nanterre
📞 Téléphone: 01 47 85 10 00
🚗 Services: Pièces auto, réparation, carte grise, diagnostic
```

#### Common Questions Auto-Responses:
- **"Horaires?"** → "Nous sommes ouverts du lundi au vendredi de 8h à 18h, le samedi de 8h à 12h"
- **"Adresse?"** → "426 Avenue de la République, 92000 Nanterre"
- **"Téléphone?"** → "01 47 85 10 00"
- **"Services?"** → "Pièces détachées, réparation, carte grise, diagnostic automobile"

### 4. Mobile App Setup
1. Download "Tawk.to" app from App Store/Google Play
2. Login with your account
3. Enable notifications for new messages
4. Set status to "Available" during business hours

### 5. Advanced Configuration

#### Business Hours:
- **Monday-Friday**: 8:00 AM - 6:00 PM
- **Saturday**: 8:00 AM - 12:00 PM  
- **Sunday**: Closed

#### Offline Message:
```
Merci de votre message! Nous sommes actuellement fermés.
Nos horaires: Lun-Ven 8h-18h, Sam 8h-12h
Nous vous répondrons dès notre réouverture.
Pour les urgences: 01 47 85 10 00
```

### 6. Testing
1. Open your website in incognito mode
2. Click the chat widget
3. Send a test message
4. Check if you receive it on your phone/app

## 🎯 Pro Tips:

### Auto-Responses for Common Queries:
- **"Prix"** → "Nos prix sont compétitifs. Contactez-nous pour un devis gratuit!"
- **"Garantie"** → "Toutes nos pièces sont garanties. Garantie constructeur incluse."
- **"Urgence"** → "Pour les urgences, appelez directement le 01 47 85 10 00"

### Widget Customization:
- **Welcome Message**: "Bonjour! Comment puis-je vous aider?"
- **Button Text**: "Besoin d'aide? Chattez avec nous!"
- **Colors**: Primary #DC2626, Secondary #FFFFFF

## 📱 Mobile Setup:
1. Download Tawk.to app
2. Enable push notifications
3. Set your status to "Available"
4. Test from different devices

## 🔧 Troubleshooting:
- **Widget not showing?** → Check if script is loaded in browser console
- **Not receiving messages?** → Check Tawk.to dashboard notifications
- **Mobile app issues?** → Reinstall app and login again

## 📊 Analytics:
- Track response times
- Monitor customer satisfaction
- View chat transcripts
- Export conversation data

---

**Next Steps:**
1. Sign up at tawk.to
2. Get your Property ID and Widget ID
3. Replace the placeholder in the code
4. Test the chat widget
5. Set up auto-responses
6. Download mobile app

Your live chat will be ready in 10 minutes! 🚀
