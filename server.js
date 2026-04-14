const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors"); // ✅ ADD THIS

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, "contacts.json");

app.use(cors()); // ✅ ADD THIS (VERY IMPORTANT)
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function readContacts() {
    if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify([]));
    return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}

function writeContacts(contacts) {
    fs.writeFileSync(DB_FILE, JSON.stringify(contacts, null, 2));
}

// GET all
app.get("/api/contacts", (req, res) => {
    res.json(readContacts());
});

// GET one
app.get("/api/contacts/:id", (req, res) => {
    const contact = readContacts().find(c => c.id === req.params.id);
    if (!contact) return res.status(404).json({ error: "Contact not found" });
    res.json(contact);
});

// POST
app.post("/api/contacts", (req, res) => {
    const { id, name, phone, email } = req.body;
    if (!id) return res.status(400).json({ error: "ID is required" });

    const contacts = readContacts();

    if (contacts.find(c => c.id === id))
        return res.status(409).json({ error: "Contact already exists" });

    const newContact = { id, name, phone, email };
    contacts.push(newContact);
    writeContacts(contacts);

    res.status(201).json(newContact);
});

// PUT
app.put("/api/contacts/:id", (req, res) => {
    const contacts = readContacts();
    const index = contacts.findIndex(c => c.id === req.params.id);

    if (index === -1)
        return res.status(404).json({ error: "Not found" });

    contacts[index] = { ...contacts[index], ...req.body };
    writeContacts(contacts);

    res.json(contacts[index]);
});

// DELETE one
app.delete("/api/contacts/:id", (req, res) => {
    const contacts = readContacts();
    const index = contacts.findIndex(c => c.id === req.params.id);

    if (index === -1)
        return res.status(404).json({ error: "Not found" });

    contacts.splice(index, 1);
    writeContacts(contacts);

    res.json({ message: "Deleted" });
});

// DELETE all
app.delete("/api/contacts", (req, res) => {
    writeContacts([]);
    res.json({ message: "All deleted" });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});