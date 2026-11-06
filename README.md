# Entreajuda

Plataforma de serviços e entreajuda para o distrito de Santarém, Portugal. Permite oferecer serviços ou procurar ajuda, através de serviços pagos, trocas e ajuda gratuita.

**Endereço atual:** https://entreajuda.infinityfree.me/

## Tecnologias

- WordPress.
- Tema ListingHive e tema filho `listinghive-child`.
- HivePress, para anúncios, categorias, campos e contas.
- HivePress Messages, para mensagens entre utilizadores.
- Loco Translate, para traduções.
- Modo claro e escuro personalizado no tema filho. O plugin de modo escuro anterior foi desativado.

## Funcionalidades

- Pesquisa de anúncios e navegação por categoria.
- Filtros por modalidades aceites, tipo de anúncio e concelho.
- Publicação de anúncios por utilizadores registados, sujeita a aprovação.
- Contacto através de mensagens privadas.
- Preço e unidade de preço opcionais.
- Campo para descrever o que se procura numa troca.

Os pagamentos e os detalhes do serviço são combinados diretamente entre os participantes. A plataforma não processa pagamentos nesta fase.

## Organização do conteúdo

### Páginas

- **Início:** página inicial estática com pesquisa, categorias e anúncios recentes.
- **Explorar serviços:** página atribuída à listagem do HivePress. O conteúdo é gerado pelo plugin; o editor da página pode estar vazio.
- **Como funciona:** apresentação das modalidades e dos passos para começar.
- **Política de privacidade:** preservada em rascunho na cópia preparada para produção; rever e publicar antes da abertura ao público.

### Categorias

- Aulas e Explicações.
- Casa e Reparações.
- Informática e Tecnologia.
- Jardim e Exterior.
- Limpezas.
- Outros Serviços.

### Campos dos anúncios

| Campo | Utilização |
| --- | --- |
| Modalidades aceites | Pago, Troca de serviços e/ou Ajuda gratuita |
| Tipo de anúncio | Ofereço um serviço ou Procuro ajuda |
| Concelho | Localização no distrito de Santarém |
| Preço (€) | Valor opcional para serviços pagos |
| Unidade do preço | Por hora, por sessão ou por serviço |
| O que procuro em troca | Descrição opcional da ajuda pretendida |

## Desenvolvimento local

O ambiente inicial utiliza Local WP e Visual Studio Code.

Os dados de ligação locais são diferentes dos dados do alojamento. Manter um `wp-config.php` adequado a cada ambiente e não incluir palavras-passe, chaves ou cópias da base de dados num repositório público.

Fazer as personalizações no tema filho. Evitar alterações nos ficheiros do WordPress, do tema pai e dos plugins, pois podem ser substituídas durante atualizações.

## Instalação e migração

1. Guardar uma cópia de segurança dos ficheiros e da base de dados de destino.
2. Copiar os ficheiros do WordPress, incluindo o tema pai, o tema filho, os plugins, as traduções e as imagens necessárias em `wp-content/uploads`.
3. Criar a base de dados no alojamento e importar o SQL preparado para esse destino.
4. Configurar `DB_NAME`, `DB_USER`, `DB_PASSWORD` e `DB_HOST` no `wp-config.php`, com os valores exatos do painel de alojamento.
5. Confirmar que `$table_prefix` corresponde ao prefixo das tabelas importadas. A cópia preparada neste projeto utiliza `wp_`.
6. Confirmar o domínio e o HTTPS. A cópia preparada para produção utiliza `https://entreajuda.infinityfree.me`.
7. Entrar na administração e guardar **Opções → Ligações permanentes**.
8. Confirmar a página inicial, a página de listagens do HivePress e os menus.
9. Testar os fluxos indicados na secção de validação.

**Atenção:** um dump completo pode substituir as tabelas existentes. Não voltar a importar a cópia inicial depois de existirem utilizadores ou anúncios reais sem um plano de migração e uma cópia de segurança.

Ao mudar novamente de domínio, utilizar uma ferramenta que respeite os dados serializados do WordPress. Uma substituição simples de texto no SQL pode danificar configurações.

### Nomes das pastas no servidor

O servidor distingue maiúsculas de minúsculas. O campo `Template` no `style.css` do tema filho deve corresponder exatamente ao nome da pasta do tema pai.

Por exemplo, se a pasta do tema pai for `listinghive`:

```css
Template: listinghive
```

Confirmar também a capitalização dos ficheiros e dos caminhos após cada envio por FTP.

## Modo claro e escuro

A preferência é controlada pelo atributo `data-ej-theme` no elemento `html`, com os valores `light` e `dark`, e guardada no armazenamento local do navegador.

As personalizações estão no tema filho, incluindo `style.css`, `functions.php` e `theme-toggle.js`. Verificar ambos os modos quando se alterarem páginas ou componentes.

O texto incorporado no logótipo não muda com a propriedade CSS `color`. Para fundos escuros, usar uma versão adequada do logótipo ou um fundo claro por trás da imagem.

## Logs de diagnóstico

No alojamento gratuito InfinityFree, não há acesso aos logs PHP e do servidor fornecidos pelo alojamento. Para diagnosticar o WordPress, pode configurar-se um ficheiro próprio.

### Configuração temporária

Criar a pasta `wp-content/logs` e, dentro dela, um ficheiro `.htaccess`:

```apache
Require all denied
```

No `wp-config.php`, antes da linha que carrega `wp-settings.php`, definir uma única vez:

```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', __DIR__ . '/wp-content/logs/wordpress.log');
define('WP_DEBUG_DISPLAY', false);

@ini_set('display_errors', '0');
```

Depois de reproduzir o problema, consultar `wp-content/logs/wordpress.log` por FTP. O ficheiro só aparece quando houver mensagens e o PHP conseguir escrever no destino.

Confirmar que o acesso pelo navegador a `/wp-content/logs/wordpress.log` é bloqueado. Não colocar dados pessoais, palavras-passe ou conteúdo de mensagens nos logs.

Esta configuração não faz rotação automática. Descarregar e eliminar periodicamente o ficheiro durante os testes. Depois do diagnóstico, voltar a definir `WP_DEBUG` como `false` e remover os logs que já não sejam necessários.

Os logs do WordPress não cobrem todos os erros: falhas anteriores ao seu carregamento e erros de configuração do servidor podem não ser registados.

## Validação após instalação ou atualização

- [ ] Início, Explorar serviços e Como funciona abrem corretamente.
- [ ] Imagens e logótipo carregam por HTTPS.
- [ ] Menus e páginas internas funcionam sem erros 404.
- [ ] Pesquisa e filtros devolvem os resultados esperados.
- [ ] Registo, entrada e saída de conta funcionam.
- [ ] Um anúncio submetido fica pendente e só aparece após aprovação.
- [ ] Mensagens funcionam nos dois sentidos entre contas de teste.
- [ ] Modo claro e escuro mantêm títulos, formulários, cabeçalho e rodapé legíveis.
- [ ] O site funciona em telemóvel, sem deslocamento horizontal indesejado.
- [ ] Logs e cópias de segurança não estão acessíveis publicamente.

Eliminar os dados criados para estes testes antes da abertura ao público.

## Manutenção

- Fazer backup da base de dados e dos ficheiros antes de atualizações importantes.
- Manter WordPress, temas e plugins atualizados e verificar os fluxos principais depois das atualizações.
- Rever anúncios pendentes e denúncias.
- Não confundir a entrega de mensagens dentro da plataforma com as notificações por email: testar ambas separadamente.
- Configurar e testar um serviço externo para envio de emails. O SMTP ainda precisa de validação no alojamento.
- Guardar as traduções personalizadas numa localização que não seja substituída pelas atualizações dos plugins.
- Nunca guardar dumps SQL, credenciais, backups ou logs desprotegidos na pasta pública do site.

## Antes da abertura ao público

- [ ] Rever e publicar a política de privacidade.
- [ ] Definir e disponibilizar regras de utilização e publicação.
- [ ] Configurar o envio de emails e testar recuperação de palavra-passe e notificações.
- [ ] Rever o formulário de registo e a informação pedida aos utilizadores.
- [ ] Confirmar a moderação manual dos anúncios.
- [ ] Confirmar que não existem anúncios, perfis ou imagens de teste.
- [ ] Guardar uma cópia de segurança e conhecer o procedimento de restauro.

## Referências

- [Diagnóstico no WordPress](https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/)
- [Diagnóstico de erros PHP no InfinityFree](https://forum.infinityfree.com/t/http-error-500-fixing-php-errors-on-your-website/49352)

---

Documentação atualizada em 6 de novembro de 2026. Não contém credenciais de acesso.
