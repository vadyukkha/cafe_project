"use client";

import { useState } from 'react';
import { createProduct } from '../lib/api';
import styles from './Admin.module.css';

interface AddProductFormProps {
    onClose: () => void;
    onBack: () => void;
}

export function AddProductForm({ onClose, onBack }: AddProductFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        volume: '',
        price: '',
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await createProduct({
                ...formData,
                volume: parseInt(formData.volume),
            });

            setSuccess('Товар успешно добавлен!');
            setFormData({ name: '', description: '', volume: '', price: '' });
            

        } catch (err: any) {
            setError(err.message || 'Произошла ошибка');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className={styles.formContainer}>
            <div className={styles.formHeader}>
                <button onClick={onBack} className={styles.backButton}>
                    ← Вернуться
                </button>
                <h3 className={styles.formTitle}>Добавить товар</h3>
                <div></div>
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}
            {success && <div className={styles.successMessage}>{success}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Название *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={styles.formInput}
                        placeholder="Название товара"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Описание *</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={4}
                        className={styles.formTextarea}
                        placeholder="Описание товара"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Объем (мл) *</label>
                    <input
                        type="text"
                        name="volume"
                        value={formData.volume}
                        onChange={handleChange}
                        required
                        pattern="^\d+$"
                        className={styles.formInput}
                        placeholder="300"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Цена (руб.) *</label>
                    <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        pattern="^\d+(\.\d{1,2})?$"
                        className={styles.formInput}
                        placeholder="199.99"
                    />
                    <p className={styles.hint}>Формат: 199.99</p>
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
                        className={styles.submitButton}
                    >
                        {loading ? 'Добавление...' : 'Добавить товар'}
                    </button>
                </div>
            </form>
        </div>
    );
}