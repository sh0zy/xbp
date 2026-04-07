import pygame
import sys
import random

pygame.init()
WIDTH, HEIGHT = 640, 480
screen = pygame.display.set_mode((WIDTH, HEIGHT))
clock = pygame.time.Clock()

# プレイヤー
player = pygame.Rect(100, 200, 32, 32)
player_speed = 3

# 鬼
oni = pygame.Rect(500, 200, 32, 32)
oni_active = False
oni_speed = 2
oni_timer = 0
oni_room = -1

# ゲーム設定
NUM_ROOMS = 10
current_room = 0
room_colors = [(30 + i*20, 30, 30) for i in range(NUM_ROOMS)]
room_puzzles = [False] * NUM_ROOMS  # 各部屋の謎解き状態
room_has_key = [random.choice([True, False]) for _ in range(NUM_ROOMS)]

# ドアとスイッチ
door = pygame.Rect(WIDTH - 40, HEIGHT//2 - 20, 20, 40)
switch = pygame.Rect(random.randint(100, 500), random.randint(100, 400), 30, 30)

# フォント
font = pygame.font.SysFont(None, 48)

def draw_flashlight(surface, player_pos):
    darkness = pygame.Surface((WIDTH, HEIGHT))
    darkness.fill((0, 0, 0))
    darkness.set_alpha(220)
    pygame.draw.circle(darkness, (0, 0, 0, 0), player_pos, 100)
    surface.blit(darkness, (0, 0), special_flags=pygame.BLEND_RGBA_SUB)

def game_over():
    text = font.render("つかまった…", True, (255, 0, 0))
    screen.blit(text, (WIDTH//2 - 100, HEIGHT//2 - 24))
    pygame.display.flip()
    pygame.time.wait(2000)
    pygame.quit()
    sys.exit()

def ending():
    screen.fill((0, 0, 0))
    text = font.render("脱出成功！", True, (0, 255, 0))
    screen.blit(text, (WIDTH//2 - 100, HEIGHT//2 - 24))
    pygame.display.flip()
    pygame.time.wait(3000)
    pygame.quit()
    sys.exit()

# メインループ
while True:
    screen.fill(room_colors[current_room])

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

    # プレイヤー移動
    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        player.x -= player_speed
    if keys[pygame.K_RIGHT]:
        player.x += player_speed
    if keys[pygame.K_UP]:
        player.y -= player_speed
    if keys[pygame.K_DOWN]:
        player.y += player_speed

    # 鬼の出現（3秒ごとにランダムな部屋に出現）
    oni_timer += 1
    if oni_timer > 180:
        oni_timer = 0
        oni_room = random.randint(0, NUM_ROOMS - 1)
        if oni_room == current_room:
            oni_active = True
            oni.x, oni.y = random.randint(100, 500), random.randint(100, 400)
        else:
            oni_active = False

    # 鬼の追跡
    if oni_active:
        if player.x > oni.x:
            oni.x += oni_speed
        elif player.x < oni.x:
            oni.x -= oni_speed
        if player.y > oni.y:
            oni.y += oni_speed
        elif player.y < oni.y:
            oni.y -= oni_speed

        if player.colliderect(oni):
            game_over()

    # 謎解き（スイッチに触れると解決）
    if not room_puzzles[current_room]:
        if player.colliderect(switch):
            room_puzzles[current_room] = True

    # ドアに触れて、謎が解けていれば次の部屋へ
    if player.colliderect(door) and room_puzzles[current_room]:
        current_room += 1
        if current_room >= NUM_ROOMS:
            ending()
        player.x, player.y = 50, HEIGHT//2
        switch.x, switch.y = random.randint(100, 500), random.randint(100, 400)

    # 描画
    pygame.draw.rect(screen, (100, 100, 255), player)
    pygame.draw.rect(screen, (200, 200, 200), door)

    if not room_puzzles[current_room]:
        pygame.draw.rect(screen, (255, 255, 0), switch)

    if oni_active:
        pygame.draw.rect(screen, (150, 0, 255), oni)

    draw_flashlight(screen, player.center)

    pygame.display.flip()
    clock.tick(60)
    # 鍵の初期化（部屋ごとに鍵があるかどうか）
room_has_key = [random.choice([True, False]) for _ in range(NUM_ROOMS)]
key_rect = pygame.Rect(0, 0, 20, 20)
has_key = False
# ドアに触れて、謎が解けていれば次の部屋へ
if player.colliderect(door) and room_puzzles[current_room]:
    if room_has_key[current_room] and not has_key:
        # 鍵が必要だけど持ってない
        pass  # ドアは開かない
    else:
        current_room += 1
        if current_room >= NUM_ROOMS:
            ending()
        player.x, player.y = 50, HEIGHT//2
        switch.x, switch.y = random.randint(100, 500), random.randint(100, 400)
        has_key = False  # 鍵は使い切り
        if room_has_key[current_room]:
            key_rect.x, key_rect.y = random.randint(100, 500), random.randint(100, 400)
# 鍵の取得
if room_has_key[current_room] and not has_key:
    if player.colliderect(key_rect):
        has_key = True
# 鍵の描画
if room_has_key[current_room] and not has_key:
    pygame.draw.rect(screen, (255, 215, 0), key_rect)
if room_has_key[current_room] and not has_key:
    lock_text = font.render("🔒", True, (255, 0, 0))
    screen.blit(lock_text, (door.x - 30, door.y - 10))
MAP_ROWS = 2
MAP_COLS = 5
map_visible = False  # 拡大表示フラグ
mini_map_rect = pygame.Rect(WIDTH - 110, 10, 100, 60)
def draw_mini_map():
    tile_w = mini_map_rect.width // MAP_COLS
    tile_h = mini_map_rect.height // MAP_ROWS
    pygame.draw.rect(screen, (50, 50, 50), mini_map_rect)
    for i in range(NUM_ROOMS):
        col = i % MAP_COLS
        row = i // MAP_COLS
        x = mini_map_rect.x + col * tile_w
        y = mini_map_rect.y + row * tile_h
        color = (100, 100, 100)
        if i == current_room:
            color = (0, 255, 0)
        pygame.draw.rect(screen, color, (x+2, y+2, tile_w-4, tile_h-4))
def draw_full_map():
    tile_w = 80
    tile_h = 60
    start_x = WIDTH//2 - (MAP_COLS * tile_w)//2
    start_y = HEIGHT//2 - (MAP_ROWS * tile_h)//2
    pygame.draw.rect(screen, (20, 20, 20), (start_x - 10, start_y - 10, tile_w*MAP_COLS + 20, tile_h*MAP_ROWS + 20))
    for i in range(NUM_ROOMS):
        col = i % MAP_COLS
        row = i // MAP_COLS
        x = start_x + col * tile_w
        y = start_y + row * tile_h
        color = (100, 100, 100)
        if i == current_room:
            color = (0, 255, 0)
        pygame.draw.rect(screen, color, (x+2, y+2, tile_w-4, tile_h-4))
        num = font.render(str(i), True, (255, 255, 255))
        screen.blit(num, (x + 25, y + 15))
elif ( event.type == pygame.MOUSEBUTTONDOWN:if mini_map_rect.collidepoint(event.pos):map_visible = not map_visible)
