const Material = require('../models/Material');

async function listMaterials(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Material.countDocuments();
    const docs = await Material.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    res.json({
      materials: docs,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (err) { next(err); }
}

async function getMaterial(req, res, next) {
  try {
    const doc = await Material.findById(req.params.id).populate('author', 'name email');
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) { next(err); }
}

async function createMaterial(req, res, next) {
  try {
    const payload = req.body;
    if (req.user) payload.author = req.user.id;
    const doc = await Material.create(payload);
    res.status(201).json(doc);
  } catch (err) { next(err); }
}

async function updateMaterial(req, res, next) {
  try {
    const { id } = req.params;
    const doc = await Material.findById(id);
    if (!doc) return res.status(404).json({ error: 'Material not found' });
    
    // Check if user is admin or is the author
    const isAdmin = req.user?.role === 'admin';
    const isAuthor = doc.author?.toString() === req.user?.id;
    if (!isAdmin && !isAuthor) {
      return res.status(403).json({ error: 'Unauthorized to update this material' });
    }
    
    // Prevent changing the author
    if (req.body.author) {
      delete req.body.author;
    }
    
    const updated = await Material.findByIdAndUpdate(id, req.body, { new: true }).populate('author', 'name email');
    res.json(updated);
  } catch (err) { next(err); }
}

async function deleteMaterial(req, res, next) {
  try {
    const { id } = req.params;
    const doc = await Material.findById(id);
    if (!doc) return res.status(404).json({ error: 'Material not found' });
    
    // Check if user is admin or is the author
    const isAdmin = req.user?.role === 'admin';
    const isAuthor = doc.author?.toString() === req.user?.id;
    if (!isAdmin && !isAuthor) {
      return res.status(403).json({ error: 'Unauthorized to delete this material' });
    }
    
    await Material.findByIdAndDelete(id);
    res.json({ ok: true });
  } catch (err) { next(err); }
}

module.exports = { listMaterials, getMaterial, createMaterial, updateMaterial, deleteMaterial };
