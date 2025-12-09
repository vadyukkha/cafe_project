"use client";

import { useState } from 'react';
import { deleteProduct } from '../lib/api';
import styles from './Admin.module.css';

interface DeleteProductFormProps {
    onClose: () => void;
    onBack: () => void;
}

export function DeleteProductForm({ onClose, onBack }: DeleteProductFormProps) {
    const [productName, setProductName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await deleteProduct(productName);

            setSuccess('Товар успешно удален!');
            setProductName('');

        } catch (err: any) {
            setError(err.message || 'Произошла ошибка');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.formContainer}>
            <div className={styles.formHeader}>
                <button onClick={onBack} className={styles.backButton}>
                    ← Вернуться
                </button>
                <h3 className={styles.formTitle}>Удалить товар</h3>
                <div></div>
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}
            {success && <div className={styles.successMessage}>{success}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Название товара для удаления *</label>
                    <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                        className={styles.formInput}
                        placeholder="Введите название товара"
                    />
                </div>

                <div className={styles.formActions}>
                    <button
                        type="button"
                        onClick={onClose}
                        className={styles.cancelButton}
                        disabled={loading}
                    >
                        Отмена
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.deleteActionButton}
                    >
                        {loading ? 'Удаление...' : 'Удалить товар'}
                    </button>
                </div>
            </form>
        </div>
    );
}