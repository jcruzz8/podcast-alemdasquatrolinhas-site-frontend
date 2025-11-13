// Em: frontend/src/components/common/RichTextEditor.jsx
import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { MenuBar } from './MenuBar'; // Importa os botões
import './RichTextEditor.css'; // Importa os estilos

// O 'content' é o HTML que vem da BD (ex: <p>Olá</p>)
// O 'onChange' é a função para atualizar o estado no (ex: setDescricao)
const RichTextEditor = ({ content, onChange }) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content: content, // Define o conteúdo inicial

        // Isto corre CADA VEZ que você escreve no editor
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML()); // Envia o HTML novo para o 'setDescricao'
        },
    });

    // Sincroniza o editor se o 'content' (vindo da BD) mudar
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content, false);
        }
    }, [content, editor]);

    return (
        <div className="rich-text-editor">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};

export default RichTextEditor;