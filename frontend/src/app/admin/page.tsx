"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AddProductForm } from '@/src/entities/admin/ui/AddProductForm';
import { EditProductForm } from '@/src/entities/admin/ui/EditProductForm';
import { DeleteProductForm } from '@/src/entities/admin/ui/DeleteProductForm';
import styles from '@/src/entities/admin/ui/Admin.module.css';

type PanelState = 'menu' | 'add' | 'edit' | 'delete';


export default function AdminPanel({ onClose }: { onClose?: () => void }) {
    const router = useRouter();
    const [panelState, setPanelState] = useState<PanelState>('menu');

    const handleClose = () => {
        if (onClose) {
            onClose();
        } else {
            router.push('/me'); 
        }
    };

    const renderContent = () => {
        switch (panelState) {
            case 'menu':
                return (
                    <div className={styles.menu}>
                        <h2 className={styles.title}>Админ панель</h2>
                        <div className={styles.buttonGrid}>
                            <button 
                                onClick={() => setPanelState('add')}
                                className={`${styles.menuButton} ${styles.addButton}`}
                            >
                                <span className={styles.buttonIcon}>+</span>
                                <span className={styles.buttonText}>Добавить товар</span>
                            </button>
                            
                            <button 
                                onClick={() => setPanelState('edit')}
                                className={`${styles.menuButton} ${styles.editButton}`}
                            >
                                <span className={styles.buttonIcon}>✎</span>
                                <span className={styles.buttonText}>Изменить товар</span>
                            </button>
                            
                            <button 
                                onClick={() => setPanelState('delete')}
                                className={`${styles.menuButton} ${styles.deleteButton}`}
                            >
                                <span className={styles.buttonIcon}>🗑</span>
                                <span className={styles.buttonText}>Удалить товар</span>
                            </button>
                        </div>
                        <button 
                            onClick={handleClose}
                            className={styles.closeButton}
                        >
                            Закрыть
                        </button>
                    </div>
                );
            
            case 'add':
                return (
                    <AddProductForm 
                        onClose={handleClose}
                        onBack={() => setPanelState('menu')}
                    />
                );
            
            case 'edit':
                return (
                    <EditProductForm 
                        onClose={handleClose}
                        onBack={() => setPanelState('menu')}
                    />
                );
            
            case 'delete':
                return (
                    <DeleteProductForm 
                        onClose={handleClose}
                        onBack={() => setPanelState('menu')}
                    />
                );
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.panel}>
                {renderContent()}
            </div>
        </div>
    );
}