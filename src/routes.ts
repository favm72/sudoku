// src/routes.js
import Board from "./routes/Board.svelte"
import Home from "./routes/Home.svelte"

export default {
  "/": Home,
  "/board/:id": Board,
}
