const s = (p) => {
	class Flock {
		constructor(){
			this.boids = [];
		}

		run() {
			for (const v of this.boids){
				v.run(this.boids);
			}
		}

		addBoid(b) {
			this.boids.push(b);
		}
	}

	class Boid {
		constructor(x,y,color) {
			this.acceleration = p.createVector(0,0);
			this.velocity = p.createVector(p.random(-1,1),p.random(-1,1));
			this.position = p.createVector(x,y);
			this.r = 10.0;
			this.maxspeed = 3;
			this.maxforce = 0.05;
			this.color = color;
		}

		run(boids) {
			this.flock(boids);
			this.update();
			this.border();
			this.render();
		}

		update(){
			this.velocity.add(this.acceleration);
			this.velocity.limit(this.maxspeed);

			this.position.add(this.velocity);
			this.acceleration.mult(0);
		}

		border() {
			if (this.position.x < -this.r)  this.position.x = p.width + this.r;
			if (this.position.y < -this.r)  this.position.y = p.height + this.r;
			if (this.position.x > p.width + this.r) this.position.x = -this.r;
			if (this.position.y > p.height + this.r) this.position.y = -this.r;
		}

		render(){
			let theta = this.velocity.heading() + p.radians(90);
			p.fill(this.color);
			p.noStroke();
			p.push();
			//p.translate(this.position.p.x,this.position.p.y);
			//p.rotate(theta);
			p.ellipse(this.position.x,this.position.y,this.r);
			p.pop();
		}

		applyforce(force) {
			this.acceleration.add(force);
		}

		flock(boids) {
			let sep = this.separate(boids);
			let ali = this.align(boids);
			let coh = this.cohesion(boids);

			sep.mult(1.5);
			ali.mult(1.0);
			coh.mult(1.0);

			this.applyforce(sep);
			this.applyforce(ali);
			this.applyforce(coh);
		}

		seek(target) {
			let desired = p5.Vector.sub(target,this.position);
			desired.normalize();
			desired.mult(this.maxspeed);

			let steer = p5.Vector.sub(desired,this.velocity);
			steer.limit(this.maxforce);

			return steer;
		}

		separate(boids) {
			let separate_paration = 25.0;
			let steer = p.createVector(0.0);
			let count = 0;
			for(const v of boids){
				let d = p5.Vector.dist(this.position,v.position);
				if(0 < d && d < separate_paration){
					let diff = p5.Vector.sub(v.velocity);
					diff.normalize();
					diff.div(d);
					steer.add(diff);
					count++;
				}
			}

			if(count > 0){
				steer.div(count);
			}

			if(steer.mag() > 0){
				steer.normalize();
				steer.mult(this.maxspeed);
				steer.sub(this.velocity);
				steer.limit(this.maxforce);
			}
			return steer;
		}

		align(boids) {
			let neighbordist = 50.0;
			let sum = p.createVector(0.0);
			let count = 0;
			for(const v of boids){
				let d = p5.Vector.dist(this.position,v.position);
				if(0 < d && d < neighbordist){
					sum.add(v.velocity);
					count++;
				}
			}
			if(count > 0){
				sum.div(count);
				sum.normalize();
				sum.setMag(this.maxspeed);

				let steer = p5.Vector.sub(sum,this.velocity);
				steer.limit(this.maxforce);
				return steer;
			}else{
				return p.createVector(0,0);
			}
		}

		cohesion(boids) {
			let neighbordist = 25.0;
			let sum = p.createVector(0.0);
			let count = 0;
			for(const v of boids){
				let d = p5.Vector.dist(this.position,v.position);
				if(0 < d && d < neighbordist){
					sum.add(v.position);
					count++;
				}
			}
			if(count > 0){
				sum.div(count);
				return this.seek(sum);
			}else{
				return p.createVector(0,0);
			}
		}
	}
};


let myp5 = new p5(s);
