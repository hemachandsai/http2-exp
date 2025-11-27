# 🚀 HTTP/1.1 vs HTTP/2 Image Chunk Loading Experiment

<p align="center">
  <img src="https://cdn.pixabay.com/photo/2017/01/17/01/28/digital-1985681_1280.jpg" 
       style="width:80%; height:450px; object-fit:cover; object-position:center;" />
</p>

This project demonstrates the practical performance differences between **HTTP/1.1** and **HTTP/2** when loading a large number of small assets — in this case, ~400 image chunks that together form a single full image.

It provides two separate endpoints serving the same content stack, allowing you to visually and network-trace the differences in:

- Connection concurrency  
- Latency  
- Request overhead  
- Server Push behavior (HTTP/2)

Perfect for learning or demonstrating why HTTP/2 drastically outperforms HTTP/1.1 for highly parallel asset loading.

---

## 📌 What This Project Does

✔ Serves a static web page that loads **384+ image fragments**  
✔ Provides two modes:

| Protocol | Port | Path | Description |
|---------|------|------|-------------|
| **HTTPS (HTTP/1.1)** | 443 | `/http1` | Standard request-per-resource loading |
| **HTTP/2 (with Server Push)** | 8443 | `/serverpush` & `/http2` | Automatically pushes all image chunks before the browser requests them |

✔ Demonstrates server-side HTTP/2 Server Push using **spdy**  
✔ Allows comparing waterfall charts in DevTools or `ss -s`

---

## 🔧 Requirements

- Node.js v16+  
- HTTPS certificates in the `certs/` folder  
- Chrome/Firefox for inspecting HTTP/2 push  

---

## ▶️ Running the Experiment

Install dependencies:

```
npm install
```

Place your TLS certificates under `certs/`.

Start the servers:

```
node server.js
```

Open in browser:

### **HTTP/1.1 Test**  
https://localhost/http1

### **HTTP/2 Test**  
https://localhost:8443/serverpush

---

## 🔬 What to Observe

### 🆚 1. Network Waterfall (DevTools → Network)

- **HTTP/1.1** → Many queued, serialized requests, limited concurrency  
- **HTTP/2** → Single connection, highly multiplexed stream transfers  

### 🚀 2. Speed Difference

HTTP/2 begins pushing all 384 image chunks immediately — even before the HTML is fully parsed — drastically reducing total resource load time.

### 📡 3. Server Push Behavior

Watch the server log as each chunk is pushed, and observe how the browser avoids making its own GET requests.

---

## 📝 Notes

- HTTP/2 Server Push is deprecated in many browsers, but still a powerful learning tool.  
- This experiment clearly showcases protocol overhead differences even without push-enabled clients.  
- Use `watch -n 1 ss -s` to observe socket behavior in real time.  

---

## 📚 Why This Experiment Exists

Loading hundreds of tiny assets is one of the worst-case scenarios for HTTP/1.1.  
This project is meant to **visualize and quantify** how HTTP/2 eliminates head-of-line blocking and request concurrency limits.
