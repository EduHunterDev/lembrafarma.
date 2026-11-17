const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { Usuario } = require('../models');
const autenticar = require('../middlewares/autenticacao');
const { errorResponse } = require('../utils/api');
router.use(autenticar);
/**
 * @swagger
 * /me/profile:
 *   put:
 *     summary: Atualizar perfil do usuário
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               photo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil atualizado
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Conta indisponível
 */
router.put('/profile', async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id);
    if (!usuario || usuario.status !== 'ativo') return res.status(401).json({ mensagem: 'Conta indisponível.' });
    const { name, photo } = req.body || {};
    if (name !== undefined && (typeof name !== 'string' || !name.trim() || name.trim().length > 80)) return res.status(400).json({ mensagem: 'O nome deve conter de 1 a 80 caracteres.' });
    if (photo !== undefined && (typeof photo !== 'string' || (photo && (!/^data:image\/(png|jpeg|webp);base64,[a-zA-Z0-9+/=]+$/.test(photo) || photo.length > 2100000)))) {
      return res.status(400).json({ mensagem: 'Foto inválida ou muito grande.' });
    }
    await usuario.update({ ...(name === undefined ? {} : { nome: name.trim() }), ...(photo === undefined ? {} : { foto: photo }) });
    return res.json({ profile: { name: usuario.nome, photo: usuario.foto || '' } });
  } catch (error) { return errorResponse(error, res, 'salvar perfil'); }
});
/**
 * @swagger
 * /me/password:
 *   put:
 *     summary: Alterar senha do usuário
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: Senha atual
 *               newPassword:
 *                 type: string
 *                 description: Nova senha (8 a 128 caracteres)
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Senha atual incorreta ou conta indisponível
 */
router.put('/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (typeof currentPassword !== 'string' || !currentPassword || typeof newPassword !== 'string' || newPassword.length < 8 || newPassword.length > 128) return res.status(400).json({ mensagem: 'Informe a senha atual e uma nova senha com 8 a 128 caracteres.' });
    const usuario = await Usuario.findByPk(req.usuario.id);
    if (!usuario || usuario.status !== 'ativo') return res.status(401).json({ mensagem: 'Conta indisponível.' });
    if (!await bcrypt.compare(currentPassword, usuario.senha)) return res.status(403).json({ mensagem: 'Senha atual incorreta.' });
    usuario.senha = await bcrypt.hash(newPassword, 10);
    await usuario.save();
    return res.json({ mensagem: 'Senha alterada com sucesso.' });
  } catch (error) { return errorResponse(error, res, 'alterar senha'); }
});
module.exports = router;
