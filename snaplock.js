(function() {
    if (document.getElementById("snapleck-gui")) return;

    // Inject Styles
    const style = document.createElement("style");
    style.innerHTML = `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        #snapleck-gui { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(1); background: #222; padding: 20px; border-radius: 10px; width: 360px;
               box-shadow: 0 0 30px rgba(255, 255, 255, 0.2); cursor: grab; transition: all 0.3s ease; z-index: 99999; opacity: 0; animation: fadeIn 0.4s forwards; border: 2px solid #555; color: white; }
        @keyframes fadeIn { to { opacity: 1; transform: translate(-50%, -50%) scale(2); } }
        .header { background: linear-gradient(45deg, #444, #222); padding: 14px; font-size: 18px; font-weight: 700; text-align: center; border-radius: 8px; color: white; }
        .option { background: #333; color: white; padding: 12px; margin: 10px 0; border-radius: 6px; cursor: pointer; font-size: 16px; text-align: center; transition: all 0.2s; border: 1px solid #444; }
        .option:hover { background: #444; transform: scale(1.05); }
        .active { background: #666 !important; }
        .exit-btn { position: absolute; top: 5px; right: 5px; background: #555; color: white; border: none; padding: 5px 10px; font-size: 14px; cursor: pointer; border-radius: 5px; }
        .exit-btn:hover { background: red; }
        .notif { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%) scale(1); background: #555; color: white; padding: 10px 20px; border-radius: 10px; display: none; font-size: 16px; font-weight: bold; animation: fadeInNotif 0.3s forwards; }
        @keyframes fadeInNotif { to { transform: translateX(-50%) scale(1); opacity: 1; } }
        .softsnap-line { position: absolute; height: 2px; background: cyan; z-index: 99998; pointer-events: none; transition: all 0.1s ease-out; }
    `;
    document.head.appendChild(style);

    // Create GUI
    const gui = document.createElement("div");
    gui.id = "snapleck-gui";
    gui.innerHTML = `
        <button class="exit-btn">X</button>
        <div class="header">😳🔥<i>snappy's</i> SNAPLOCK🔥😳</div>
        <div class="option" id="softSnap">Enable SoftSnapLock</div>
        <div class="option" id="snapping">Enable Snapping</div>
    `;
    document.body.appendChild(gui);

    // Create Notification
    const notifBox = document.createElement("div");
    notifBox.id = "notifBox";
    notifBox.className = "notif";
    document.body.appendChild(notifBox);

    const softSnapBtn = document.getElementById("softSnap");
    const snappingBtn = document.getElementById("snapping");
    let softSnapActive = false, snappingActive = false;

    // Event Listeners for SoftSnap and Snapping Modes
    softSnapBtn.addEventListener("click", () => {
        softSnapActive = !softSnapActive;
        toggleSoftSnap(softSnapActive);
    });

    snappingBtn.addEventListener("click", () => {
        snappingActive = !snappingActive;
        toggleSnapping(snappingActive);
    });

    // Toggle SoftSnapLock
    function toggleSoftSnap(isActive) {
        if (isActive) {
            showNotification("SoftSnapLock Enabled ✅");
            document.addEventListener("mousemove", drawLinesToElements);
        } else {
            showNotification("SoftSnapLock Disabled ❌");
            document.querySelectorAll(".softsnap-line").forEach(line => line.remove());
            document.removeEventListener("mousemove", drawLinesToElements);
        }
        updateButtonState(softSnapBtn, isActive);
    }

    // Toggle Snapping Mode
    function toggleSnapping(isActive) {
        if (isActive) {
            showNotification("Snapping Mode Activated ✅");
            document.addEventListener("mouseover", replaceWithImage);
        } else {
            showNotification("Snapping Mode Deactivated ❌");
            document.querySelectorAll(".snapped-image").forEach(img => img.remove());
            document.removeEventListener("mouseover", replaceWithImage);
        }
        updateButtonState(snappingBtn, isActive);
    }

    // Draw Lines to Elements (SoftSnap)
    function drawLinesToElements(event) {
        // Remove existing lines
        document.querySelectorAll(".softsnap-line").forEach(line => line.remove());

        // Draw a line from each element to the mouse cursor
        document.querySelectorAll("body *").forEach(element => {
            const style = window.getComputedStyle(element);
            if (element !== gui && element.offsetWidth > 0 && element.offsetHeight > 0 && style.display !== "none" && style.visibility !== "hidden") {
                let rect = element.getBoundingClientRect();
                let centerX = rect.left + rect.width / 2;
                let centerY = rect.top + rect.height / 2;

                let line = document.createElement("div");
                line.className = "softsnap-line";
                
                // Calculate the distance and direction to the mouse cursor
                let length = Math.hypot(centerX - event.clientX, centerY - event.clientY);
                let angle = Math.atan2(event.clientY - centerY, event.clientX - centerX); // Get the angle between the element center and cursor
                
                // Position and size the line
                line.style.width = `${length}px`;
                line.style.left = `${centerX - length / 2}px`; // Position the line from the center of the element to the cursor
                line.style.top = `${centerY - length / 2}px`;
                line.style.transform = `rotate(${angle}rad)`; // Rotate the line to point towards the cursor

                document.body.appendChild(line);
            }
        });
    }

    // Replace Element with Image (Snapping)
    function replaceWithImage(event) {
        if (snappingActive && event.target !== gui) {
            let rect = event.target.getBoundingClientRect();
            let img = document.createElement("img");
            img.src = "https://i.ytimg.com/vi/zW2hionXnqo/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDqyEmbuqVsdkSoPWHlXi8_GDv2hA";
            img.className = "snapped-image";
            img.style.position = "absolute";
            img.style.left = `${rect.left}px`;
            img.style.top = `${rect.top}px`;
            img.style.width = `${rect.width}px`;
            img.style.height = `${rect.height}px`;
            img.style.zIndex = "99999";
            document.body.appendChild(img);
        }
    }

    // Show Notification
    function showNotification(msg) {
        notifBox.innerHTML = msg;
        notifBox.style.display = "block";
        clearTimeout(window.notificationTimeout);
        window.notificationTimeout = setTimeout(() => {
            notifBox.style.display = "none";
        }, 1500);
    }

    // Update Button State
    function updateButtonState(button, isActive) {
        if (isActive) {
            button.classList.add("active");
            button.innerText = button.innerText.replace("Enable", "Disable");
        } else {
            button.classList.remove("active");
            button.innerText = button.innerText.replace("Disable", "Enable");
        }
    }

    // Exit Button (with animation)
    document.querySelector(".exit-btn").addEventListener("click", () => {
        gui.style.opacity = 0;
        setTimeout(() => gui.remove(), 300);  // Wait for the fade-out animation to finish
    });

})();
