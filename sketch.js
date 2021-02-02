const s = (p) => {
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

	}
};


let myp5 = new p5(s);
