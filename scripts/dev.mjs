import { spawn } from "node:child_process";

const commands = [
  [process.execPath, ["--disable-warning=ExperimentalWarning", "server/index.js"]],
  [process.execPath, ["node_modules/vite/bin/vite.js", "--host", "127.0.0.1"]],
];
const children = commands.map(([command, args]) => spawn(command, args, { stdio: "inherit", shell: false }));
const stop = () => children.forEach((child) => child.kill());
process.on("SIGINT", () => { stop(); process.exit(0); });
process.on("SIGTERM", () => { stop(); process.exit(0); });
children.forEach((child) => child.on("exit", (code) => { if (code && code !== 0) { stop(); process.exit(code); } }));
