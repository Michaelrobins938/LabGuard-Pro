import { Router } from 'express'
import { equipmentDetailController } from '../controllers/equipment-detail.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import multer from 'multer'

const router = Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname)
  }
})

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and documents
    if (file.mimetype.startsWith('image/') || 
        file.mimetype.startsWith('application/pdf') ||
        file.mimetype.startsWith('application/msword') ||
        file.mimetype.startsWith('application/vnd.openxmlformats-officedocument')) {
      cb(null, true)
    } else {
      cb(null, false)
    }
  }
})

// Equipment Overview
router.get('/:id/overview', authMiddleware, equipmentDetailController.getEquipmentOverview)

// Equipment Analytics
router.get('/:id/analytics', authMiddleware, equipmentDetailController.getEquipmentAnalytics)

// Equipment Maintenance
router.get('/:id/maintenance', authMiddleware, equipmentDetailController.getEquipmentMaintenance)

// Equipment Documents
router.get('/:id/documents', authMiddleware, equipmentDetailController.getEquipmentDocuments)
router.post('/:id/documents', authMiddleware, upload.single('file'), equipmentDetailController.uploadDocument)

// Equipment Photos
router.get('/:id/photos', authMiddleware, equipmentDetailController.getEquipmentPhotos)
router.post('/:id/photos', authMiddleware, upload.single('file'), equipmentDetailController.uploadPhoto)

// Equipment Settings
router.get('/:id/settings', authMiddleware, equipmentDetailController.getEquipmentSettings)
router.put('/:id/settings', authMiddleware, equipmentDetailController.updateEquipmentSettings)

// QR Code Generation
router.post('/:id/qr-code', authMiddleware, equipmentDetailController.generateQRCode)

// Performance Logging
router.post('/:id/performance', authMiddleware, equipmentDetailController.logPerformance)

// Equipment Relations
router.get('/:id/relations', authMiddleware, equipmentDetailController.getEquipmentRelations)
router.post('/:id/relations', authMiddleware, equipmentDetailController.createEquipmentRelation)

export default router 