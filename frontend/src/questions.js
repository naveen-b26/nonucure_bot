export const questions = {
    Male: [
      {
        id: "healthConcern",
        text: "Select your primary health concern:",
        options: ["Hair Loss", "Sexual Health", "Beard Growth"],
      },
      {
        id: "hairStage",
        text: "Please select your hair stage:",
        options: [
          { text: "Stage 1 (Slightly hair loss)", image: "/hair-stages/stage1.jpg" },
          { text: "Stage 2 (Hair line receding)", image: "/hair-stages/stage2.jpg" },
          { text: "Stage 3 (Developing bald spot)", image: "/hair-stages/stage3.jpg" },
          { text: "Stage 4 (Visible bald spot)", image: "/hair-stages/stage4.jpg" },
          { text: "Stage 5 (Balding from crown area)", image: "/hair-stages/stage5.jpg" },
          { text: "Stage 6 (Advanced balding)", image: "/hair-stages/stage6.jpg" },
          { text: "Heavy Hair Fall", image: "/hair-stages/heavy-fall.jpg" },
          { text: "Coin Size Patch", image: "/hair-stages/coin-patch.jpg" },
        ],
        condition: (answers) => answers.healthConcern === "Hair Loss",
        showImages: true,
      },
      {
        id: "dandruff",
        text: "Do you have dandruff?",
        options: ["Yes", "No"],
        condition: (answers) => answers.healthConcern === "Hair Loss",
      },
      {
        id: "dandruffStage",
        text: "Select your dandruff stage:",
        options: ["Low", "Mild", "Moderate", "Severe"],
        condition: (answers) => answers.healthConcern === "Hair Loss" && answers.dandruff === "Yes",
      },
      {
        id: "thinningOrBaldSpots",
        text: "Are you experiencing hair thinning or bald spots?",
        options: ["Yes, both", "Yes, thinning only", "Yes, bald spots only", "No", "I'm not sure"],
        condition: (answers) => answers.healthConcern === "Hair Loss",
      },
      {
        id: "energyLevels",
        text: "How would you rate your energy levels?",
        options: ["High", "Medium", "Low"],
        condition: (answers) => answers.healthConcern === "Hair Loss",
      },
    ],
    Female: [
      {
        id: "naturalHair",
        text: "What does your hair look like naturally?",
        options: ["Straight", "Curly", "Wavy", "Coily"],
      },
      {
        id: "goal",
        text: "What is your current goal?",
        options: ["Control hair fall", "Regrow Hair"],
      },
      {
        id: "hairFall",
        text: "Do you feel more hair fall than usual?",
        options: ["Yes, extreme", "Mild", "No"],
      },
      {
        id: "mainConcern",
        text: "Choose your main concern:",
        options: ["Hair thinning", "Coin size patches", "Medium widening", "Advanced widening", "Less volume on sides"],
      },
    ],
  }
  
  