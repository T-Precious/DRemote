import tkinter as tk

def handle_button_click():
    label.config(text="Button clicked")

root = tk.Tk()

label = tk.Label(root, text="Button not clicked")
label.pack()

button = tk.Button(root, text="Click me", command=handle_button_click)
button.pack()

root.mainloop()