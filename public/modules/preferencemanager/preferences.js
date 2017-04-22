function Preferences() {
  this.appconfig = [
    {
      id: "opt0",
      text: "Allow the app to send diagnostic data to CS3337 Group 4",
      value: "opt0",
      checked: false
    },
    {
      id: "opt1",
      text: "Offline Mode (not implemented yet)",
      value: "opt1",
      checked: false
    },
    {
      id: "opt2",
      text: "Use graphics hardware acceleration (prototyping)",
      value: "opt2",
      checked: false
    },
    {
      id: "opt3",
      text: "Ask user about their progress on startup",
      value: "opt3",
      checked: true
    },
    {
      id: "opt4",
      text: "Automatically check for updates",
      value: "opt4",
      checked: true
    }
  ];
}
