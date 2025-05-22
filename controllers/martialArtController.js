
const MartialArt = require('../models/MartialArt');

// Obter todas as artes marciais
exports.getAllMartialArts = async (req, res) => {
  try {
    const martialArts = await MartialArt.find()
      .sort({ createdAt: -1 }) // Ordena do mais recente para o mais antigo
      .populate('createdBy', 'name email');

    res.json(martialArts.map(art => ({
      id: art._id,
      name: art.name,
      description: art.description,
      origin: art.origin,
      foundedYear: art.foundedYear,
      location: art.location,
      styles: art.styles,
      imageUrl: art.imageUrl,
      createdBy: art.createdBy._id,
      createdAt: art.createdAt
    })));
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar artes marciais',
      error: error.message 
    });
  }
};

// Obter arte marcial por ID
exports.getMartialArtById = async (req, res) => {
  try {
    const martialArt = await MartialArt.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!martialArt) {
      return res.status(404).json({ message: 'Arte marcial não encontrada' });
    }

    res.json({
      id: martialArt._id,
      name: martialArt.name,
      description: martialArt.description,
      origin: martialArt.origin,
      foundedYear: martialArt.foundedYear,
      location: martialArt.location,
      styles: martialArt.styles,
      imageUrl: martialArt.imageUrl,
      createdBy: martialArt.createdBy._id,
      createdAt: martialArt.createdAt
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar arte marcial',
      error: error.message 
    });
  }
};

// Criar nova arte marcial
exports.createMartialArt = async (req, res) => {
  try {
    const { 
      name, description, origin, foundedYear, 
      location, styles, imageUrl 
    } = req.body;

    const newMartialArt = new MartialArt({
      name,
      description,
      origin,
      foundedYear,
      location,
      styles,
      imageUrl,
      createdBy: req.user.id
    });

    const savedMartialArt = await newMartialArt.save();
    await savedMartialArt.populate('createdBy', 'name email');

    res.status(201).json({
      id: savedMartialArt._id,
      name: savedMartialArt.name,
      description: savedMartialArt.description,
      origin: savedMartialArt.origin,
      foundedYear: savedMartialArt.foundedYear,
      location: savedMartialArt.location,
      styles: savedMartialArt.styles,
      imageUrl: savedMartialArt.imageUrl,
      createdBy: savedMartialArt.createdBy._id,
      createdAt: savedMartialArt.createdAt
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao criar arte marcial',
      error: error.message 
    });
  }
};

// Atualizar arte marcial
exports.updateMartialArt = async (req, res) => {
  try {
    const { 
      name, description, origin, foundedYear,
      location, styles, imageUrl 
    } = req.body;

    // Verificar se a arte marcial existe
    let martialArt = await MartialArt.findById(req.params.id);
    if (!martialArt) {
      return res.status(404).json({ message: 'Arte marcial não encontrada' });
    }

    // Verificar se o usuário é o criador da arte marcial
    if (martialArt.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Não autorizado a atualizar esta arte marcial' });
    }

    // Atualizar campos
    if (name) martialArt.name = name;
    if (description) martialArt.description = description;
    if (origin) martialArt.origin = origin;
    if (foundedYear !== undefined) martialArt.foundedYear = foundedYear;
    if (location) martialArt.location = location;
    if (styles) martialArt.styles = styles;
    if (imageUrl) martialArt.imageUrl = imageUrl;

    const updatedMartialArt = await martialArt.save();
    await updatedMartialArt.populate('createdBy', 'name email');

    res.json({
      id: updatedMartialArt._id,
      name: updatedMartialArt.name,
      description: updatedMartialArt.description,
      origin: updatedMartialArt.origin,
      foundedYear: updatedMartialArt.foundedYear,
      location: updatedMartialArt.location,
      styles: updatedMartialArt.styles,
      imageUrl: updatedMartialArt.imageUrl,
      createdBy: updatedMartialArt.createdBy._id,
      createdAt: updatedMartialArt.createdAt
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao atualizar arte marcial',
      error: error.message 
    });
  }
};

// Deletar arte marcial
exports.deleteMartialArt = async (req, res) => {
  try {
    // Verificar se a arte marcial existe
    const martialArt = await MartialArt.findById(req.params.id);
    if (!martialArt) {
      return res.status(404).json({ message: 'Arte marcial não encontrada' });
    }

    // Verificar se o usuário é o criador da arte marcial
    if (martialArt.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Não autorizado a deletar esta arte marcial' });
    }

    await MartialArt.findByIdAndDelete(req.params.id);
    res.json({ message: 'Arte marcial removida com sucesso' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao deletar arte marcial',
      error: error.message 
    });
  }
};
