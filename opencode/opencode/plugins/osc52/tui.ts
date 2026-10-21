import { Plugin } from "@opencode/plugin/tui"

// OpenTUI wraps OSC 52 in a tmux DCS passthrough envelope whenever it detects
// tmux, and tmux drops that envelope unless `allow-passthrough` is enabled.
// Its Wayland host clipboard is unusable on GNOME too: Mutter implements
// neither ext_data_control_v1 nor zwlr_data_control_v1, and the core
// wl_data_device fallback is compiled in for WSL only.
//
// Replace the renderer's OSC 52 writer with a plain sequence. tmux parses
// plain OSC 52 itself and forwards it to the terminal when `set-clipboard` is
// enabled, which is the same path OpenCode v1 used.

const sequence = (text: string) => `\x1b]52;c;${Buffer.from(text, "utf8").toString("base64")}\x07`

export default Plugin.define({
  id: "osc52-plain",
  setup(context) {
    const renderer = context.renderer as unknown as {
      copyToClipboardOSC52?: (text: string, target?: number) => boolean
    }
    const original = renderer.copyToClipboardOSC52
    if (typeof original !== "function") return

    const write = (text: string) => {
      process.stdout.write(sequence(text))
      return true
    }

    let installed = false
    try {
      renderer.copyToClipboardOSC52 = write
      installed = renderer.copyToClipboardOSC52 === write
    } catch {}
    if (!installed) {
      try {
        Object.getPrototypeOf(renderer).copyToClipboardOSC52 = write
        installed = true
      } catch {}
    }

    return () => {
      if (!installed) return
      try {
        renderer.copyToClipboardOSC52 = original
      } catch {}
      try {
        Object.getPrototypeOf(renderer).copyToClipboardOSC52 = original
      } catch {}
    }
  },
})
