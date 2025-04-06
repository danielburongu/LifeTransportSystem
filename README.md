
# Life-Transport System

**Life-Transport System** is a smart, real-time emergency coordination platform designed to simplify **Ambulance Dispatch**, enable **Police Accident Verification**, improve **Hospital Emergency Coordination**, and provide quick citizen access via **QR Codes**. It unifies citizens, emergency responders, and hospitals into one fast, reliable, and secure platform.
## Hompage

![Life Transport System Screenshot](https://drive.google.com/uc?id=1NoZPB6fOcmdQ3Lawy-ZZN4__TVBhjAUp)

---

## Features

- ### Emergency Request Submission via QR
![Hospital Intake Panel](https://drive.google.com/uc?id=1L-o0jizJK47GLcUXq3Mi5gzyrgn5AdFD)  

- 👮 Police Dashboard to verify accident claims 
- Ambulance Allocation System using geolocation and urgency level  
- Hospital Dashboard for intake tracking and status updates  
- Secure Role-Based Access Control (citizens, police, ambulance, hospital)
- ### Citizens request form Dashboard  
![Police Verification Dashboard](https://drive.google.com/uc?id=16Q8NotSMjDq2hHfNMnb5zN9qVK0nkVA6)  
- 💬 Real-Time Communication between all parties  

---

## 🔗 Links

-  [Demo Video](https://drive.google.com/file/d/1BNOZCgXg3Q63gWx0FCylq2ahE0xS9F2u/view?usp=sharing)  
-  [Live App](https://life-transport-system-zxel-nu.vercel.app/)  
-  [App Walkthrough](https://www.loom.com/share/deb9709b8c3544a69f97c41f1105d851?sid=7455d8a8-c2c3-48cc-bd8a-4c055d3c506b)  
-  [Figma Mockup](https://www.figma.com/design/6yAeXnj47xGo2NNlevgpIS/Ambulance-Dispatch-System?node-id=0-1&t=bYbpTjP9XMgyfmsn-1) 

## Project Setup

### Frontend

```bash
cd frontend
npm install
npm start
```

- URL: `http://localhost:3000`

### Backend

```bash
cd backend
npm install
```

Create a `.env` file with the following:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

```bash
npm start
```

- URL: `http://localhost:5000`

---

## 🗂️ Project Structure

```
root/
├── frontend/
│   ├── components/
│   ├── pages/
│   └── App.js
├── backend/
│   ├── models/
│   ├── routes/
│   └── controllers/
├── .env
└── README.md
```

---

## 📡 API Example

**POST** `/request`  
Middleware: `authMiddleware`

**Fields:**
- `location`
- `emergency_type`

**Response:**
```
"Emergency request created successfully."
```

---

## MongoDB Schema

**EmergencyRequestSchema**

```javascript
{
  user: ObjectId, // ref: User
  location: String,
  emergency_type: String, // e.g., accident, fire, medical
  urgency_level: String, // Critical, Urgent, Normal
  status: String // default: pending
}
```

---

## 🌍 Deployment

- **Frontend**: Vercel  
- **Backend**: Render  
- **Database**: MongoDB Atlas  

---

## 🔄 System Flow

1. User sends request via QR/manual form  
2. Police verify and approve accident reports  
3. Ambulance is dispatched based on urgency/location  
4. Hospital tracks incoming patient status  
5. Hospital confirms arrival and treats patient  
6. System logs and closes incident  

---

## 🧑‍💼 Dashboards

| Role    | Features |
|---------|----------|
| **Police** | View and verify accidents, Dispatch coordination |
| **Ambulance** | View assigned emergencies, Update location/status |
| **Hospital** | Track incoming patients, Mark arrival, Allocate beds |
| **User** | Send request, Track response, Receive updates |

---

## Panel Feedback

### 1. **Software Distribution Beyond Personal Reach**
**Feedback**: How will you distribute the software beyond your reach?  
**Action Taken**: In the Deployment Strategy section, I elaborated that I will leverage police weekly bulletins and media house partnerships to disseminate the platform and its QR code system nationwide. This ensures the app is accessible even in all areas through existing stakeholder networks.

### 2. **Emergency Prioritization in Multi-Emergency Scenarios**
**Feedback**: How do you prioritize dispatch in cases of multiple emergencies?  
**Action Taken**: I enhanced the QR emergency request form by adding a dropdown menu to capture the urgency level of each case (e.g., Critical, Urgent, Normal). This priority classification is now part of the emergency data stored and used during dispatch to help hospitals and drivers prioritize critical cases more efficiently.

### 3. **Incorporation of AI for Prediction or Optimization**
**Feedback**: Can AI be used for predictive dispatching or future optimization?  
**Action Taken**: While I do not currently have machine learning expertise, I acknowledged the potential of AI integration and added a new section titled “Future Work: AI Integration.” This section discusses how AI could be used in future phases for predictive analytics and automated decision support for dispatch optimization.

---

## Future Work: AI Integration

As emergency response systems scale in complexity and usage, the integration of artificial intelligence (AI) offers transformative potential. While this version of Life Transport Systems does not yet include AI functionalities, future iterations will aim to incorporate machine learning models to enhance decision-making, dispatch optimization, and predictive analysis.

### Potential AI-Powered Enhancements:
- **Predictive Dispatching**: Analyze historical emergency trends, time-of-day patterns, and traffic data to pre-position ambulances.  
- **Urgency Classification (NLP)**: Automatically classify the urgency level of incoming cases using text description analysis.  
- **Hospital Load Balancing**: Evaluate real-time hospital capacity and recommend the most optimal destination.  
- **Resource Optimization**: Match the best-suited ambulance or responder team by analyzing distance, emergency type, and traffic.

> These AI features would require further research and partnerships with data science experts. The current system architecture supports modular expansion, making future AI integration technically feasible.

---

## 👤 Contact

- **Email**: d.burongu@alustudent.com 
- **GitHub**: [github.com/danielburongu](https://github.com/danielburongu)

---

## 🤝 Contributing

1. Fork the repository  
2. Create your feature branch (`git checkout -b feature/new-feature`)  
3. Commit your changes (`git commit -m 'Add new feature'`)  
4. Push to the branch (`git push origin feature/new-feature`)  
5. Open a Pull Request  

For bugs and feature requests, please open an issue [here](https://github.com/danielburongu/LifeTransportSystem/issues).

---

### Built with ❤️ to save lives.
