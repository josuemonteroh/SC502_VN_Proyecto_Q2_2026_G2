<?php

class Conexion {

    private $host = "database";
    private $db = "nyvora_db";
    private $user = "root";
    private $pass = "root";
    private $charset = "utf8mb4";

    public function conectar() {

        try {

            $dsn = "mysql:host=" . $this->host .
                   ";dbname=" . $this->db .
                   ";charset=" . $this->charset;

            $opciones = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ];

            $conexion = new PDO(
                $dsn,
                $this->user,
                $this->pass,
                $opciones
            );

            return $conexion;

        } catch (PDOException $e) {

            die("Error de conexión: " . $e->getMessage());

        }
    }
}
?>