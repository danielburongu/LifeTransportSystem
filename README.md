# Life Transport System

## Project Overview
The **Life Transport System** is a **an emergency response platform** designed to streamline:
- **Ambulance Dispatch**
- **Police Accident Verification** 
- **Hospital Emergency Coordination** 
- **Secure Authentication** via QR Code


This system ensures **efficient, secure, and rapid** response to emergencies by integrating **users, emergency responders, and medical institutions** into a **unified digital framework**.

---

## Key Features
✅ **Emergency Request Submission** – Users can request assistance using a **QR code login** or **manual request**.  
✅ **Police Accident Verification** – Verified accident reports ensure **hospital and ambulance dispatch coordination**.  
✅ **Ambulance Dispatch System** – Automatically assigns available ambulances based on **GPS tracking**.  
✅ **Hospital Dashboard** – Tracks **incoming patients**, **resource allocation**, and **arrival confirmations**.  
✅ **Real-Time WebSockets Communication** – Ensures **live updates** between **users, police, ambulances, and hospitals**.  
✅ **Secure Role-Based Access Control** – Different dashboards for **police, hospital staff, and patients(citizens)**.  

---

## GitHub Repository
🔗 **[View on GitHub](https://github.com/danielburongu/LifeTransportSystem.git)**  

---

## Setup Instructions
### Clone the Repository
```bash
git clone https://github.com/danielburongu/LifeTransportSystem.git
cd LifeTransportSystem
```

### Backend Setup
```bash
cd backend
npm install
```
- Configure **.env**:
  ```env
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_secret_key
  PORT=5000
  ```
- Start Server:
  ```bash
  npm start
  ```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
- App runs at **http://localhost:3000**  
- API runs at **http://localhost:5000**

---

## UI/UX Design
### Design Process
- **Wireframes & Mockups**: Created using **Figma**
- **Style Guide**: Uses **Material UI + Tailwind CSS** for modern design.



🔗 **[View Designs on Figma](https://www.figma.com/design/6yAeXnj47xGo2NNlevgpIS/Ambulance-Dispatch-System?node-id=0-1&t=bYbpTjP9XMgyfmsn-1)**

---

## Project Architecture
```
LifeTransportSystem/
│── frontend/
│   ├── src/
│   │   ├── components/    
│   │   ├── pages/ 
│   │   ├── assets/  
│   │   ├── App.js
│── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── server.js    
│── docs/              
│── README.md              
│── package.json            
│── .env                    
```

---

## Backend Development
### Server-Side Code
Built with **Node.js & Express.js**  
Implements **JWT authentication, role-based access, REST API endpoints**.

**API Route**
```javascript
router.post('/request', authMiddleware, async (req, res) => {
    const { location, emergency_type } = req.body;
    try {
        const newRequest = new EmergencyRequest({ user: req.user.id, location, emergency_type });
        await newRequest.save();
        res.status(201).json({ message: "Emergency request created successfully." });
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});
```

### Database Schema
```javascript
const EmergencyRequestSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    location: { type: String, required: true },
    emergency_type: { type: String, enum: ['accident', 'fire', 'medical'] },
    status: { type: String, default: 'pending' },
});
```

---

## Deployment
### Hosting Platforms
- **Frontend**: **Vercel / Netlify**
- **Backend**: **Render / AWS**
- **Database**: **MongoDB Atlas**

### Deployment Steps
```bash
git push origin main
```
- **Deploy Backend** → **Render**
- **Deploy Frontend** → **Vercel**


---

## Video Demonstration
**[Watch Demo Video](https://drive.google.com/file/d/18UkRtdSP_Z-NT_C3i1FKXShTmzhCHrKy/view?usp=sharing)**

---

## Functionality Demonstration
### Emergency Process Flow
1. **User Sends Emergency Request** – Fills form with location, accident type.
2. **Police Verification** – Request is reviewed and verified.
3. **Ambulance Dispatch** – Available ambulance is assigned.
4. **Hospital Intake** – Patient is marked as arrived.
5. **Incident Resolution** – Case is completed and logged.

---

## Dashboards Overview
### **Police Dashboard**
- **View & Verify Accidents**
- **Manage Emergency Cases**
- **Track Reports in Real-Time**

### **Ambulance Dashboard**
- **Receive Dispatch Orders**
- **Track Assigned Cases**
- **Update Status (On the Way, Arrived, etc.)**

### **Hospital Dashboard**
- **View Incoming Patients**
- **Assign Doctors & Resources**
- **Mark Patient Arrivals**

### **Patient Dashboard**
- **Request Emergency Services**
- **Track Live Status of Requests**
- **Receive Updates & Alerts**

📂 **View Code Files**:
- [Frontend](https://github.com/danielburongu/LifeTransportSystem/tree/main/frontend)
- [Backend](https://github.com/danielburongu/LifeTransportSystem/tree/main/backend)

---

## How to Contribute
**Want to contribute?**  
- Fork the repo & create a **pull request**  
- Submit **bug reports & feature requests** under [Issues](https://github.com/danielburongu/LifeTransportSystem/issues)  

**Contact Us:** [d.burongu@alustudent.com](mailto:d.burongu@alustudent.com)
---

### **Emergency Response Made Faster & Smarter!**