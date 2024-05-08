const express = require('express');
const router = express.Router();

const supportTicketController = require('../controllers/supportTicketController');
const authController = require('../controllers/authController');
router.post(
  '/',
  authController.protect,
  authController.checkUserRole('buyer'),
  supportTicketController.addSupportImages,
  supportTicketController.newSupportTicket,
);
router.get(
  '/',
  authController.protect,
  authController.checkUserRole('buyer'),
  supportTicketController.getAllTickets,
);

router.get(
  '/admin',
  authController.protect,
  authController.checkUserRole('admin'),
  supportTicketController.getTicketsForAdmin,
);
router.patch(
  '/admin',
  authController.protect,
  authController.checkUserRole('admin'),
  supportTicketController.upodateTicket,
);
router.delete(
  '/admin',
  authController.protect,
  authController.checkUserRole('admin'),
  supportTicketController.deleteTicket,
);
module.exports = router;
