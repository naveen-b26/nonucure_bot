document.addEventListener("DOMContentLoaded", () => {
    const fetchButton = document.getElementById("fetchButton");
    const downloadButton = document.getElementById("downloadButton");
    fetchButton.addEventListener("click", fetchUsers);
    downloadButton.addEventListener("click", downloadList);
});

let fetchedData = {}; // Store fetched data globally

async function fetchUsers() {
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const genderFilter = document.getElementById("genderFilter").value;
    console.log(startDate,endDate)
    if (!startDate || !endDate) {
        alert("Please select both start and end dates.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ startDate, endDate })
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        fetchedData = await response.json(); // Store fetched data
        populateTable(fetchedData, genderFilter);
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

function populateTable(data, genderFilter) {
    const usersBody = document.getElementById("usersBody");

    // Clear existing rows
    usersBody.innerHTML = "";

    // Filter users based on gender
    let users = [];
    if (genderFilter === "Male") {
        users = data.maleUsers;
    } else if (genderFilter === "Female") {
        users = data.femaleUsers;
    } else {
        users = [...data.maleUsers, ...data.femaleUsers]; // All users if no filter
    }

    // Create a map for recommendations by userId
    const recommendationsMap = {};
    data.maleRecommendations.forEach(rec => {
        recommendationsMap[rec.userId] = rec.kit; // Assuming you want to show the kit name
    });
    data.femaleRecommendations.forEach(rec => {
        recommendationsMap[rec.userId] = rec.kit; // Assuming you want to show the kit name
    });

    // Sort users by name
    users.sort((a, b) => a.name.localeCompare(b.name));

    // Populate users
    users.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.gender}</td>
            <td>${user.healthConcern}</td>
            <td>${recommendationsMap[user._id] || "No Recommendations"}</td>
        `;
        usersBody.appendChild(row);
    });
}

function downloadList() {
    // Prepare male users data
    const maleUsers = fetchedData.maleUsers.map(user => ({
        Name: user.name,
        Email: user.email,
        Phone: user.phone,
        Gender: user.gender,
        HealthConcern: user.healthConcern,
        Recommendations: fetchedData.maleRecommendations
            .filter(rec => rec.userId === user._id)
            .map(rec => rec.kit)
            .join(", ") || "No Recommendations"
    }));

    // Prepare female users data
    const femaleUsers = fetchedData.femaleUsers.map(user => ({
        Name: user.name,
        Email: user.email,
        Phone: user.phone,
        Gender: user.gender,
        HealthConcern: user.healthConcern,
        Recommendations: fetchedData.femaleRecommendations
            .filter(rec => rec.userId === user._id)
            .map(rec => rec.kit)
            .join(", ") || "No Recommendations"
    }));

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    const maleSheet = XLSX.utils.json_to_sheet(maleUsers);
    const femaleSheet = XLSX.utils.json_to_sheet(femaleUsers);

    // Append sheets to the workbook
    XLSX.utils.book_append_sheet(wb, maleSheet, "Male Users");
    XLSX.utils.book_append_sheet(wb, femaleSheet, "Female Users");

    // Write the workbook to a file
    XLSX.writeFile(wb, "UserRecommendations.xlsx");
}