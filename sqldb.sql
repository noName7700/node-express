PGDMP     -    ,                 |            courses-app    15.2    15.2 !    $           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            %           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            &           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            '           1262    74084    courses-app    DATABASE     �   CREATE DATABASE "courses-app" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Russian_Russia.1251';
    DROP DATABASE "courses-app";
                postgres    false            �            1259    74106    cart    TABLE     Z   CREATE TABLE public.cart (
    courseid integer,
    userid integer,
    count integer
);
    DROP TABLE public.cart;
       public         heap    postgres    false            �            1259    74085    course    TABLE     �   CREATE TABLE public.course (
    id integer NOT NULL,
    price double precision,
    title character varying,
    img character varying,
    userid integer DEFAULT 1 NOT NULL
);
    DROP TABLE public.course;
       public         heap    postgres    false            �            1259    74088    course_id_seq    SEQUENCE     �   ALTER TABLE public.course ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.course_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    214            �            1259    74125    order    TABLE     \   CREATE TABLE public."order" (
    userid integer,
    date date,
    id integer NOT NULL
);
    DROP TABLE public."order";
       public         heap    postgres    false            �            1259    74166    order_course    TABLE     c   CREATE TABLE public.order_course (
    orderid integer,
    courseid integer,
    count integer
);
     DROP TABLE public.order_course;
       public         heap    postgres    false            �            1259    74151    order_id_seq    SEQUENCE     �   ALTER TABLE public."order" ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.order_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    218            �            1259    74094    user    TABLE     �   CREATE TABLE public."user" (
    email character varying,
    name character varying,
    id integer NOT NULL,
    password character varying,
    avatar character varying
);
    DROP TABLE public."user";
       public         heap    postgres    false            �            1259    74195    user_id_seq    SEQUENCE     �   ALTER TABLE public."user" ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.user_id_seq
    START WITH 2
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    216            �            1259    74187    user_session    TABLE     �   CREATE TABLE public.user_session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);
     DROP TABLE public.user_session;
       public         heap    postgres    false                      0    74106    cart 
   TABLE DATA           7   COPY public.cart (courseid, userid, count) FROM stdin;
    public          postgres    false    217   �"                 0    74085    course 
   TABLE DATA           ?   COPY public.course (id, price, title, img, userid) FROM stdin;
    public          postgres    false    214   #                 0    74125    order 
   TABLE DATA           3   COPY public."order" (userid, date, id) FROM stdin;
    public          postgres    false    218   !$                 0    74166    order_course 
   TABLE DATA           @   COPY public.order_course (orderid, courseid, count) FROM stdin;
    public          postgres    false    220   ]$                 0    74094    user 
   TABLE DATA           C   COPY public."user" (email, name, id, password, avatar) FROM stdin;
    public          postgres    false    216   z$                  0    74187    user_session 
   TABLE DATA           9   COPY public.user_session (sid, sess, expire) FROM stdin;
    public          postgres    false    221   �%       (           0    0    course_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.course_id_seq', 14, true);
          public          postgres    false    215            )           0    0    order_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.order_id_seq', 8, true);
          public          postgres    false    219            *           0    0    user_id_seq    SEQUENCE SET     9   SELECT pg_catalog.setval('public.user_id_seq', 7, true);
          public          postgres    false    222            }           2606    74105    course course_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.course DROP CONSTRAINT course_pkey;
       public            postgres    false    214            �           2606    74165    order pk 
   CONSTRAINT     H   ALTER TABLE ONLY public."order"
    ADD CONSTRAINT pk PRIMARY KEY (id);
 4   ALTER TABLE ONLY public."order" DROP CONSTRAINT pk;
       public            postgres    false    218            �           2606    74193    user_session session_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.user_session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);
 C   ALTER TABLE ONLY public.user_session DROP CONSTRAINT session_pkey;
       public            postgres    false    221                       2606    74100    user user_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public."user" DROP CONSTRAINT user_pkey;
       public            postgres    false    216            �           1259    74194    IDX_session_expire    INDEX     O   CREATE INDEX "IDX_session_expire" ON public.user_session USING btree (expire);
 (   DROP INDEX public."IDX_session_expire";
       public            postgres    false    221            �           2606    74109    cart courseId    FK CONSTRAINT     p   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT "courseId" FOREIGN KEY (courseid) REFERENCES public.course(id);
 9   ALTER TABLE ONLY public.cart DROP CONSTRAINT "courseId";
       public          postgres    false    3197    217    214            �           2606    74196    order_course courseid    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_course
    ADD CONSTRAINT courseid FOREIGN KEY (courseid) REFERENCES public.course(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 ?   ALTER TABLE ONLY public.order_course DROP CONSTRAINT courseid;
       public          postgres    false    220    3197    214            �           2606    74169    order_course orderid    FK CONSTRAINT     u   ALTER TABLE ONLY public.order_course
    ADD CONSTRAINT orderid FOREIGN KEY (orderid) REFERENCES public."order"(id);
 >   ALTER TABLE ONLY public.order_course DROP CONSTRAINT orderid;
       public          postgres    false    3201    220    218            �           2606    74114    cart userId    FK CONSTRAINT     l   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT "userId" FOREIGN KEY (userid) REFERENCES public."user"(id);
 7   ALTER TABLE ONLY public.cart DROP CONSTRAINT "userId";
       public          postgres    false    216    217    3199            �           2606    74120    course userId    FK CONSTRAINT     x   ALTER TABLE ONLY public.course
    ADD CONSTRAINT "userId" FOREIGN KEY (userid) REFERENCES public."user"(id) NOT VALID;
 9   ALTER TABLE ONLY public.course DROP CONSTRAINT "userId";
       public          postgres    false    214    3199    216            �           2606    74133    order userId    FK CONSTRAINT     o   ALTER TABLE ONLY public."order"
    ADD CONSTRAINT "userId" FOREIGN KEY (userid) REFERENCES public."user"(id);
 :   ALTER TABLE ONLY public."order" DROP CONSTRAINT "userId";
       public          postgres    false    3199    216    218                  x������ � �         �   x�=��j�0Ek�7�,i4�d-,)҄�TI�����֬�����Vs�-��()��;��֝�Qˁ�|�b�ᴈ�B�Q����`��l�6�����;�L�=�>?]�����e�ӝ�y΅�UL^@v�$;��ՠe@p�X'/SI������}�Oz	缶놭it�|���P�雗�D��q/A�Q+D��8�1%��}�Qi1&�,�$� }^hN�o����۲dCz�2��Q��ib�{�]��jW\@         ,   x�3�4202�50�50�4�2D�q#�Ɯ�\��\�=... \�
S            x������ � �         %  x�MO�n�0<���!�:6K 7�(QB�������]�b0d���H�r���Ӽ7��3����m�]B �*DRBmr�``@X�n6�� n��H%#�F������]X7�us��k�df��7�&���"|�]^�����[�O�,�^���􂲿\0
�'>,6v����(Jep��Z�X�l��n�o���t�B�'/\-W̏�&������k(E��E��Z։�������Nօ�Y����Ӵ�Ks���8}���Κ]rN2&��HW����jh�r߲�L���(�F~o�          �  x���]o�0��˯�,.!u�J�UZ4��,�C��ILb�8�6����k�MӤi�M-��=:��sٝ
O_�o΢;.��`�l����/V���+�"%�WP0��1:;���c�� >���L�8LhV[�#n�	��=xo�����C������G!�,��
G%�"rkF��N��цj_TÆ�6��?0�vn������&�:��N��3m��>��I�>�
0>�Y���i]B��qi�Jˑcv��9"�tE=ʫ�H�Q��1 ⑪�R�؝[$秂I�j��	�T�T�`�}�2{�_Q燧yn��{�v�$����:�\�|� ��@2�Ř�ɣv��uM����y�p���m=�H0$DG?��]���ۺ��[���9{�^�Σ�d��Zg�e���������薙b�Nԋ��u��s/�����'l�o�G�e��\�_r��R�쨦�,��6�z�R7�s���G��K�ՠ$����?6ޔF�����     