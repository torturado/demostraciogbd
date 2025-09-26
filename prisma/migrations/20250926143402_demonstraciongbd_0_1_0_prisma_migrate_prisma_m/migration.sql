-- CreateTable
CREATE TABLE `client` (
    `idclient` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telefon` VARCHAR(191) NOT NULL,
    `contrasenya` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `client_email_key`(`email`),
    PRIMARY KEY (`idclient`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reserva` (
    `idreserva` INTEGER NOT NULL AUTO_INCREMENT,
    `idclient` INTEGER NOT NULL,
    `data` TIMESTAMP(6) NOT NULL,
    `num_persones` INTEGER NOT NULL,
    `estado` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idreserva`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pedido` (
    `idpedido` INTEGER NOT NULL AUTO_INCREMENT,
    `idclient` INTEGER NOT NULL,
    `data` DATE NOT NULL,
    `total` DECIMAL(10, 2) NOT NULL,
    `estado` VARCHAR(191) NOT NULL,
    `metode_pago` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idpedido`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detall_pedido` (
    `iddetall` INTEGER NOT NULL AUTO_INCREMENT,
    `idpedido` INTEGER NOT NULL,
    `idproducte` INTEGER NOT NULL,
    `quantitat` INTEGER NOT NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`iddetall`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `producte` (
    `idproducte` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `preu` DECIMAL(10, 2) NOT NULL,
    `idcategoria` INTEGER NOT NULL,
    `disponible` BOOLEAN NOT NULL,

    PRIMARY KEY (`idproducte`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categoria` (
    `idcategoria` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idcategoria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `reserva` ADD CONSTRAINT `reserva_idclient_fkey` FOREIGN KEY (`idclient`) REFERENCES `client`(`idclient`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pedido` ADD CONSTRAINT `pedido_idclient_fkey` FOREIGN KEY (`idclient`) REFERENCES `client`(`idclient`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detall_pedido` ADD CONSTRAINT `detall_pedido_idpedido_fkey` FOREIGN KEY (`idpedido`) REFERENCES `pedido`(`idpedido`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detall_pedido` ADD CONSTRAINT `detall_pedido_idproducte_fkey` FOREIGN KEY (`idproducte`) REFERENCES `producte`(`idproducte`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `producte` ADD CONSTRAINT `producte_idcategoria_fkey` FOREIGN KEY (`idcategoria`) REFERENCES `categoria`(`idcategoria`) ON DELETE RESTRICT ON UPDATE CASCADE;
