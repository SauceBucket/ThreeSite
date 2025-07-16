const output = document.getElementById("output");
const input = document.getElementById("input");

window.onload = () => input.focus();

input.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const command = input.value.trim();
    if (command === "") return;
    appendText(`> ${command}`);
    handleCommand(command.toLowerCase());
    input.value = "";
  }
});

function appendText(text) {
  output.textContent += "\n" + text;
  output.scrollTop = output.scrollHeight;
}

function handleCommand(cmd) {
  switch (cmd) {
    case "look":
      appendText("You are in a dark room. There is a door to the north.");
      break;
    case "go north":
      appendText("You enter a hallway lit by flickering torches.");
      break;
    case "help":
      appendText("Try commands like 'look', 'go north', or 'help'.");
      break;
    case "art":
    showArt(`
    /\\_/\\  
    ( o.o ) 
    > ^ <  
    `);
    break;
    case "no":
    hideArt();
    break;
    default:
      appendText("I don't understand that command.");
  }
}

function showArt(asciiArt) {
  const overlay = document.getElementById("art-overlay");
  overlay.textContent = asciiArt;
  overlay.style.display = "block";
}

function hideArt() {
  const overlay = document.getElementById("art-overlay");
  overlay.style.display = "none";
}
